import Database from '@main/database'
import { EmailBoxEnum } from '@src/domains'
import type { ContactType, EmailBoxType, EmailType } from '@src/domains/types'
import { ImapFlow, type MailboxLockObject } from 'imapflow'
import { ContactEntities, MailEntities } from '../database/entities'

const getMailQueryBuilder = async () => {
    return Database.getRepository(MailEntities)
}

const getContectQueryBuilder = async () => {
    return Database.getRepository(ContactEntities)
}

function findAttachments(structure: any, results: any[] = []) {
    if (structure.disposition) {
        console.log(structure.disposition, 'structure')
    }
    if (
        structure?.type?.toLowerCase() === 'attachment' ||
        structure.type?.toLowerCase() === 'attachment' ||
        !!(structure.disposition?.params?.filename || structure.parameters?.name)
    ) {
        results.push(structure)
    }
    if (structure.childNodes) {
        for (const child of structure.childNodes) {
            findAttachments(child, results)
        }
    }
    return results
}

function mergeContacts(contacts: any[], email: string): Partial<ContactType>[] {
    const arr = [...contacts].filter(item => item.address !== email).filter(c => !!c.address) || []

    return arr
        .reduce((acc, cur) => {
            const exists = acc.some((item: any) => item.address === cur.address && item.name === cur.name)
            if (!exists) acc.push(cur)
            return acc
        }, [])
        .map((item: any) => {
            return {
                email: item?.address,
                name: item?.name,
            }
        })
}

function buildMailboxMenu(mailboxes: any[]): EmailBoxType[] {
    const map: Record<string, EmailBoxType> = {}

    mailboxes.forEach(box => {
        if (box.flags && box.flags['\\NoSelect']) return

        map[box.path] = {
            key: box.path,
            name: box.name || box.pathAsListed,
            specialUse: box.specialUse,
            children: [],
        }
    })

    const tree: EmailBoxType[] = []

    Object.values(map).forEach(node => {
        const box = mailboxes.find(b => b.path === node.key)
        if (box?.parentPath && map[box.parentPath]) {
            map[box.parentPath].children!.push(node)
        } else {
            tree.push(node)
        }
    })

    return tree
}

export class MailClientManager {
    private info = {} as EmailType
    private client: ImapFlow
    private lock?: MailboxLockObject
    constructor(data: EmailType) {
        this.info = data
        this.client = new ImapFlow({
            logger: false,
            host: data.host,
            port: data.port,
            secure: true,
            auth: {
                user: data.email,
                pass: data.password,
            },
        })
    }

    async onInit() {
        await this.connect()
        setInterval(async () => {
            if (this.client.usable) {
                try {
                    await this.client.noop()
                } catch (err) {
                    console.log(err, 'err')
                }
            }
        }, 30000)
        this.client.on('exists', data => {
            console.log('接收到了新的邮件\n')
            console.log(JSON.stringify(data))
        })
        this.client.on('error', async err => {
            console.log('mail client error:', err)
            await this.connect()
        })
        this.client.on('close', async () => {
            console.log('close mail client')
            await this.connect()
        })
    }

    async connect() {
        await this.client.connect()
    }
    async isConnected() {
        return this.client.usable
    }
    async logout() {
        await this.client.logout()
        if (this.lock) {
            this.lock.release()
        }
    }

    async getBoxes(): Promise<EmailBoxType[]> {
        const list = await this.client.list()
        return buildMailboxMenu(list)
    }

    async checkMail() {
        const boxes = await this.getBoxes()
        // const boxes = [
        // 	{
        // 		key: "INBOX",
        // 		name: "INBOX",
        // 		specialUse: EmailBoxEnum.Inbox,
        // 	},
        // ];
        for (let i = 0; i < boxes.length; i++) {
            this.lock = await this.client.getMailboxLock(boxes[i].key)
            await this.initMails(boxes[i]?.name)
            this.lock.release()
        }
        if (boxes.find(item => item.specialUse === EmailBoxEnum.Inbox)?.key) {
            this.lock = await this.client.getMailboxLock(
                (boxes || []).find(item => item.specialUse === EmailBoxEnum.Inbox)?.key!
            )
        }
    }

    async openBox(box: string) {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.lock) {
                    this.lock.release()
                }
                await this.client?.mailboxOpen(box)
                resolve(true)
            } catch (err) {
                reject(err)
            }
        })
    }

    async readMail(id: string) {
        return new Promise(async (resolve, reject) => {
            const mailBuilder = await getMailQueryBuilder()
            const find = await mailBuilder.findOne({
                where: {
                    id,
                },
            })
            if (find && find?.uid) {
                await this.client
                    .messageFlagsAdd([find?.uid], ['\\Seen'], { uid: true })
                    .then(() => {
                        console.log('Update Read Success')
                    })
                    .catch(err => {
                        console.log('Update Read Failed:', err)
                    })
                find.isRead = true
                await mailBuilder.save(find)
                resolve(find)
            } else {
                reject('未找到邮件')
            }
        })
    }

    async initMails(mailbox: string) {
        try {
            const mailBuilder = await getMailQueryBuilder()
            const contectBuilder = await getContectQueryBuilder()

            const remoteUids = await this.client.search({}, { uid: true })
            const existing = await mailBuilder.find({
                where: { emailId: this.info?.email, boxPath: mailbox },
                select: ['uid'],
            })
            const existingUids = new Set(existing.map(m => m.uid))
            const toFetch = ((remoteUids || []).filter(uid => !existingUids.has(uid)) || []).sort((a, b) => b - a)

            for (let i = 0; i < toFetch.length; i++) {
                const uid = toFetch[i]
                const isExist = await mailBuilder.findOne({
                    where: {
                        uid,
                        emailId: this.info.email,
                        boxPath: mailbox,
                    },
                })
                if (isExist?.id) {
                    continue
                }

                for await (const msg of this.client.fetch(
                    uid,
                    {
                        uid: true,
                        envelope: true,
                        source: true,
                        flags: true,
                        bodyStructure: true,
                    },
                    { uid: true }
                )) {
                    const isRead = Array.from(msg?.flags || []).includes('\\Seen') || false

                    const attachments = findAttachments(msg.bodyStructure).map(item => {
                        return {
                            name: item?.dispositionParameters?.filename,
                            size: item?.size,
                            type: item?.type,
                            encoding: item?.encoding,
                        }
                    })

                    const from = msg.envelope?.from || []
                    const sender = msg.envelope?.sender || []
                    const replyTo = msg.envelope?.replyTo || []
                    const senderTo = msg.envelope?.to || []
                    const contacts = mergeContacts([...from, ...sender, ...replyTo, ...senderTo], this.info.email)
                    await Promise.allSettled(
                        contacts.map(async item => {
                            const isExist = await contectBuilder.findOne({
                                where: {
                                    email: item.email,
                                    name: item.name,
                                },
                            })
                            if (!isExist?.id) {
                                await contectBuilder.save(item)
                            }
                        })
                    )

                    const data = {
                        uid: msg.uid,
                        isRead,
                        boxPath: mailbox,
                        subject: msg.envelope?.subject,
                        emailId: this.info.email,
                        source: msg?.source,
                        status: Array.from(msg?.flags || []),
                        form: msg.envelope?.from?.map(item => {
                            return {
                                name: item?.name,
                                email: item?.address,
                            }
                        }),
                        sender: msg?.envelope?.sender?.map(item => {
                            return {
                                name: item?.name,
                                email: item?.address,
                            }
                        }),
                        replyTo: msg?.envelope?.replyTo?.map(item => {
                            return {
                                name: item?.name,
                                email: item?.address,
                            }
                        }),
                        to: msg?.envelope?.to?.map(item => {
                            return {
                                name: item?.name,
                                email: item?.address,
                            }
                        }),
                        date: msg?.envelope?.date,
                        attachments,
                    }

                    await mailBuilder.save(data as any)
                    console.log(data?.subject, data?.date, 'data')
                    console.log('写入邮件成功!')
                }
            }
        } catch (err) {
            console.log('写入邮件错误:', err)
        } finally {
            console.log('全部写入邮件完成')
        }
    }
}
