// import dayjs from "dayjs";
// import {BaseWindow, ipcMain, WebContentsView} from "electron"
// // @ts-ignore
// import ImapType, {Config} from "@types/imap"
// import {BaseViewBounds} from "@src/main";
// import {IPCChannel, MailAccountInfo} from "@src/types/ipc";
// import {isDev} from "@main/utils/tools";
// import path from "path";
// import MailService from "@src/dataBase/service/mail";
// import {MailEntities} from "@src/dataBase/entities/mail";
// import {MailPlatform} from "@src/types/mail";
//
// const Imap = require('imap');
// const {simpleParser} = require('mailparser');
//
// interface Props {
//     baseWindow: BaseWindow;
//     mailType: MailPlatform;
//     config: Config;
//     openType?: "INBOX";
//     searchType?: "ALL" | "ANSWERED" | "DELETED" | "DRAFT" | "FLAGGED" | "RECENT"
// }
//
// const loadMainUrl: string = isDev
//     ? `http://localhost:${process.env.PORT}`
//     : `file://${path.resolve(__dirname, '../render/mail-view.html')}`;
//
// const Mail = ({baseWindow, config, openType, searchType, mailType}: Props) => {
//     const imap: ImapType = new Imap({
//         ...config,
//         keepalive: {
//             interval: 10000,
//             idleInterval: 10000
//         }
//     });
//     let totalMail: number[] = [];
//
//     const MailView = new WebContentsView({
//         webPreferences: {
//             nodeIntegration: true,
//             webSecurity: false,
//             preload: path.resolve(__dirname, "./preload.js")
//         }
//     });
//     MailView.webContents.openDevTools({
//         mode: 'detach'
//     })
//     MailView.setBounds(BaseViewBounds);
//     MailView.webContents.loadURL(loadMainUrl)
//         .finally(() => {
//             MailView.webContents.send(IPCChannel.MailAccountInfo, {
//                 account: config.user,
//                 type: mailType
//             } as MailAccountInfo)
//         })
//
//     if (baseWindow) {
//         baseWindow.contentView.addChildView(MailView)
//         baseWindow.on("resize", () => {
//             const bounds = baseWindow?.getBounds();
//             MailView.setBounds({
//                 ...BaseViewBounds,
//                 width: bounds?.width || 1072,
//                 height: (bounds?.height || 778) - 50
//             })
//         })
//     }
//
//
//     ipcMain.handle(IPCChannel.GetMailAccountInfo, () => {
//         return {
//             account: config.user,
//             type: mailType
//         }
//     })
//
//     ipcMain.handle(IPCChannel.GetMailSynchronizeStatus, async (_, data: MailAccountInfo) => {
//         const total = await MailService.getMailListCount(data)
//         return {
//             total: totalMail.length || 0,
//             ready: total || 0
//         }
//     })
//
//     ipcMain.handle(IPCChannel.MailBoxList, () => {
//         return new Promise((resolve) => {
//             imap.getBoxes((err, mailboxes) => {
//                 if (err) {
//                     return resolve([])
//                 }
//                 const arr = Object.keys(mailboxes).map(item => {
//                     return {
//                         name: item,
//                         attribs: mailboxes[item].attribs || [],
//                         delimiter: mailboxes[item].delimiter
//                     }
//                 })
//                 resolve(arr);
//             })
//         })
//     })
//
//     ipcMain.handle(IPCChannel.CheckNewMail, () => {
//         return new Promise((resolve) => {
//             imap.search([["ALL"]], async (_, results) => {
//                 // 定时检查邮件，有新的邮件需要发送详情，并且需要同步到本地的库
//                 const lastMail = await MailService.getLastMail({
//                     account: config.user,
//                     type: mailType
//                 })
//                 const uids = results.sort((a, b) => a - b);
//                 if (lastMail?.uid === uids[uids.length - 1]) {
//                     return resolve([])
//                 }
//                 const lastMailIndex = uids.indexOf(lastMail?.uid as number)
//                 const newUids = uids.splice(lastMailIndex);
//                 if (newUids.length === 0 || !newUids) {
//                     return resolve([])
//                 }
//                 const mails = await handleResults(newUids);
//                 resolve(mails);
//             });
//         })
//     })
//
//     const handleOpenByType = (callback: (error: Error, mailbox: ImapType.Box) => void) => {
//         imap.openBox(openType || "INBOX", callback)
//     }
//
//     const arraysAreEqualIgnoreOrder = (arr1: number[], arr2: number[]) => {
//         if (arr1.length !== arr2.length) {
//             return false;
//         }
//         const sortedArr1 = arr1.slice().sort((a, b) => a - b);
//         const sortedArr2 = arr2.slice().sort((a, b) => a - b);
//         return sortedArr1.every((value, index) => value === sortedArr2[index]);
//     }
//
//     const handleParseMail = (uid: number | string): Promise<MailEntities> => {
//         return new Promise((resolve, reject) => {
//             const f = imap.fetch(uid, {bodies: ''});
//             f.on('message', (msg) => {
//                 let info: any = {};
//
//                 msg.on('attributes', (attrs) => {
//                     info.uid = attrs.uid || 0;
//                     info.isRead = attrs.flags.includes('\\Seen');
//                 });
//                 msg.on('body', (stream) => {
//                     simpleParser(stream, (err: any, parsed: any) => {
//                         if (err) return reject(err);
//                         info.subject = parsed.subject || "未知主题";
//                         info.fromAddress = parsed.from?.value?.[0].address || "未知发件地址";
//                         info.fromName = parsed.from?.value?.[0].name || "未知发件人";
//                         info.toAddress = parsed.to?.value?.[0].address || "";
//                         info.toName = parsed.to?.value?.[0].name || "";
//                         info.date = parsed.date ? dayjs(parsed.date).format("YYYY-MM-DD HH:mm:ss") : "";
//                         info.html = parsed.html || "";
//                         info.text = parsed.text || "";
//                         info.type = mailType;
//                         info.account = config.user || "";
//
//                         resolve(info);
//                     })
//                 })
//                 msg.once('error', (err) => {
//                     reject(err);
//                 });
//
//             })
//             f.once('error', (err) => {
//                 reject(err);
//             });
//         })
//     }
//
//     const handleResults = (data: number[]) => {
//         return new Promise(async (resolve) => {
//             let isReadyMailList: any[] = await MailService.getMailAllUid({
//                 account: config.user,
//                 type: mailType
//             })
//             isReadyMailList = isReadyMailList.map(item => item.uid);
//             console.log("本地存在邮件数量:", isReadyMailList.length, "，服务器上邮件数量:", data.length);
//             const isSameArr = arraysAreEqualIgnoreOrder(isReadyMailList, data);
//             // 比较库中的uid全部相等则不请求
//             if (isSameArr) {
//                 return;
//             }
//             const _data = data.filter(item => !isReadyMailList.some(child => child === item))
//             console.log(" =======> 接收到新的邮件, uids: ", _data)
//             const fetchPromises = (_data || []).map(uid => {
//                 return handleParseMail(uid)
//             })
//             Promise.all(fetchPromises)
//                 .then((infos: any[]) => {
//                     MailService.insertMail(infos);
//                     resolve(infos)
//                 })
//         })
//
//     }
//
//
//     imap.on('ready', () => {
//         handleOpenByType(() => {
//             imap.search([[(searchType || "ALL")]], (err, results) => {
//                 totalMail = results;
//                 if (!err) {
//                     handleResults(results)
//                 } else {
//                     MailView.webContents.send(IPCChannel.MailError)
//                 }
//             });
//         })
//     });
//
//     imap.on('error', () => {
//         MailView.webContents.send(IPCChannel.MailError)
//     });
//
//     imap.on('end', function () {
//         console.log('Connection ended, after 3s reconnect');
//         setTimeout(() => {
//             console.log("重新连接...")
//             imap.connect();
//         }, 3000)
//     });
//
//     imap.connect();
// }
//
// export default Mail;

import {WebContentsView, BaseWindow, ipcMain} from "electron";
import {isDev} from "@src/main/utils/tools";
import {MailBoxNameType, MailPlatform} from "@src/types/mail";
//@ts-ignore
import ImapType, {Config} from "@types/imap";
import path from "path";
import {BaseViewBounds} from "@src/main";
import {IPCChannel, MailAccountInfo} from "@src/types/ipc";
import MailService from "@src/dataBase/service/mail";
import dayjs from "dayjs";

const Imap = require('imap');
const {simpleParser} = require('mailparser');

interface Props {
    baseWindow: BaseWindow;
    mailType: MailPlatform;
    config: Config;
}

const loadMainUrl: string = isDev
    ? `http://localhost:${process.env.PORT}`
    : `file://${path.resolve(__dirname, '../render/mail-view.html')}`;

const handleTypeMailType = (box: any): MailBoxNameType => {
    if (["inbox"].includes(box?.name?.toLowerCase())) {
        return "INBOX"
    } else if (box?.attribs?.some((item: string) => item?.toLowerCase()?.indexOf("junk") > -1)) {
        return "JUNK"
    } else if (box?.attribs?.some((item: string) => item?.toLowerCase()?.indexOf("trash") > -1)) {
        return "TRASH"
    } else if (box?.attribs?.some((item: string) => item?.toLowerCase()?.indexOf("sent") > -1)) {
        return "SENT"
    } else if (box?.attribs?.some((item: string) => item?.toLowerCase()?.indexOf("drafts") > -1)) {
        return "DRAFTS"
    } else if (box?.attribs?.some((item: string) => item?.toLowerCase()?.indexOf("archive") > -1)) {
        return "ARCHIVE"
    } else {
        return "INBOX"
    }
}

class Mail {
    account: string = "";
    platform: MailPlatform = MailPlatform.QQ;
    view: WebContentsView | null = null;
    imap: ImapType | null = null;
    private isInitReady: boolean = false;
    private boxList: any[] = [];

    // private totalMail: number[] = [];

    constructor(props: Props) {
        this.account = props?.config.user;
        this.platform = props?.mailType;
        this.initMailView(props.baseWindow);
        this.initImap(props.config);
        // this.initIPC();
    }

    initIPC() {
        // ipcMain.handle(IPCChannel.ChangeMailAccount, (_, account: MailAccountInfo) => {
        //     return new Promise(() => {
        //         if (account.type === this.platform && account.account === this.account && this.view) {
        //             console.log(account, 'account')
        //             this.view.setVisible(true)
        //         } else if (account.type !== this.platform && account.account !== this.account && this.view) {
        //             console.log(account, 'account false')
        //             this.view.setVisible(false)
        //         }
        //     })
        // })
        ipcMain.handle(IPCChannel.CheckNewMail, () => {
            return new Promise((resolve) => {
                this.handleOpenBoxByType(() => {
                    this.imap?.search([["ALL"]], async (_, results) => {
                        // 定时检查邮件，有新的邮件需要发送详情，并且需要同步到本地的库
                        let allMail = await MailService.getMailAllUid({
                            account: this.account,
                            type: this.platform
                        })
                        const allMailUid = (allMail || [])?.map(item => item.uid) as number[]
                        const isSame = this.arraysAreEqualIgnoreOrder(allMailUid, results);
                        if (isSame) {
                            return resolve([]);
                        }
                        const newUids = results.filter(item => !allMailUid.some(child => child === item))
                        const mails = await this.handleInsertMailByUid(newUids, "INBOX");
                        resolve(mails);
                    });
                }, "INBOX")
            })
        })
        // 检查当前邮箱是否初始化成功
        ipcMain.handle(IPCChannel.CheckInitMailReady, () => {
            return this.isInitReady;
        })
        // 获取邮箱所有的 MailBox
        ipcMain.handle(IPCChannel.MailBoxList, () => {
            return this.boxList || [];
        })
        // 获取当前实例化的账号的平台
        // ipcMain.handle(IPCChannel.GetMailAccountInfo, () => {
        //     return {
        //         account: this.account,
        //         type: this.platform,
        //     }
        // })
    }

    initMailView(baseWindow: BaseWindow) {
        // if (this.view && !this.view?.webContents.isDestroyed()) {
        //     // this.view.setVisible(true)
        //     return;
        // }
        if (baseWindow && !baseWindow?.isDestroyed()) {
            this.view = new WebContentsView({
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: false,
                    preload: path.resolve(__dirname, "./preload.js")
                }
            })
            console.log(this.view.webContents.id, "this.view.webContents.id")
            this.view.setBounds(BaseViewBounds);
            // this.view.setVisible(true)
            this.view.webContents.loadURL(loadMainUrl)
                .finally(() => {
                    this.view?.webContents.send(IPCChannel.GetMailAccountInfo, {
                        account: this.account,
                        type: this.platform,
                        viewId: this.view?.webContents.id
                    })
                })
            baseWindow?.contentView.addChildView(this.view);
            if (isDev) {
                this.view.webContents.openDevTools({
                    mode: 'detach'
                })
            }

        }
    }


    initImap(config: Config) {
        this.imap = new Imap({
            ...config,
            keepalive: {
                interval: 10000,
                idleInterval: 10000
            }
        });

        this.imapCore();
        this.imap?.on('error', () => {
            console.log("链接失败...")
            this.view?.webContents.send(IPCChannel.MailError)
        });

        this.imap?.on('end', () => {
            console.log('Connection ended, after 3s reconnect');
            setTimeout(() => {
                console.log("重新连接...")
                this.imapCore();
            }, 3000)
        });

    }

    handleOpenBoxByType = (callback: (error: Error, mailbox: ImapType.Box) => void, boxName?: string) => {
        this.imap?.openBox(boxName || "INBOX", callback)
    }


    imapCore() {
        this.imap?.connect();
        this.imap?.on('ready', () => {
            this.isInitReady = true;
            this.imap?.getBoxes((err, mailboxes) => {
                if (err) {
                    this.boxList = []
                    return;
                }
                const arr = Object.keys(mailboxes).map(item => {
                    return {
                        name: item,
                        type: handleTypeMailType(mailboxes[item])
                    }
                })
                this.handleDownLoadAllMailByBox(arr.map(item => item.name))
                this.boxList = arr;
            })
            // this.handleOpenBoxByType(() => {
            //     this.imap?.search([[("ALL")]], (err, results) => {
            //         this.totalMail = results;
            //         if (!err) {
            //             this.handleInsertMailByUid(results)
            //         } else {
            //             this.view?.webContents.send(IPCChannel.MailError)
            //         }
            //     });
            // })
        });
    }

    private arraysAreEqualIgnoreOrder(arr1: number[], arr2: number[]) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const sortedArr1 = arr1.slice().sort((a, b) => a - b);
        const sortedArr2 = arr2.slice().sort((a, b) => a - b);
        return sortedArr1.every((value, index) => value === sortedArr2[index]);
    }

    // 遍历所有的文件夹并且下载所有邮件
    private async handleDownLoadAllMailByBox(box: string[]) {
        for (let i = 0; i < box.length; i++) {
            await new Promise(async () => {
                this.handleOpenBoxByType(() => {
                    this.imap?.search([[("ALL")]], async (err, results) => {
                        if (!err) {
                            await this.handleInsertMailByUid(results, box[i])
                        } else {
                            this.view?.webContents.send(IPCChannel.MailError)
                        }
                    });
                }, box[i])
            })

        }
    }


    // 根据 uid 入库邮件
    private handleInsertMailByUid(uid: number[], boxName?: string) {
        return new Promise(async (resolve) => {
            console.log(" =======> 开始入库新邮件, uids: ", uid)
            const fetchPromises = (uid || []).map(uid => {
                return this.handleParseMail(uid, boxName || "INBOX")
            })
            return Promise.all(fetchPromises)
                .then((infos: any[]) => {
                    resolve(infos)
                    return MailService.insertMail(infos);
                })
        })
    }

    // 解析邮件的内容
    private handleParseMail(uid: number, boxName?: string) {
        return new Promise((resolve, reject) => {
            if (!this.imap) return reject();
            const f = this.imap.fetch(uid, {bodies: ''});
            f.on('message', (msg) => {
                let info: any = {};

                msg.on('attributes', (attrs) => {
                    info.uid = attrs.uid || 0;
                    info.isRead = attrs.flags.includes('\\Seen');
                });
                msg.on('body', (stream) => {
                    simpleParser(stream, (err: any, parsed: any) => {
                        if (err) return reject(err);
                        info.subject = parsed.subject || "未知主题";
                        info.fromAddress = parsed.from?.value?.[0].address || "未知发件地址";
                        info.fromName = parsed.from?.value?.[0].name || "未知发件人";
                        info.toAddress = parsed.to?.value?.[0].address || "";
                        info.toName = parsed.to?.value?.[0].name || "";
                        info.date = parsed.date ? dayjs(parsed.date).format("YYYY-MM-DD HH:mm:ss") : "";
                        info.html = parsed.html || "";
                        info.text = parsed.text || "";
                        info.type = this.platform;
                        info.account = this.account || "";
                        info.boxName = boxName || "INBOX"

                        resolve(info);
                    })
                })
                msg.once('error', (err) => {
                    reject(err);
                });

            })
            f.once('error', (err) => {
                reject(err);
            });
        })
    }

}

export default Mail

