import Database from "@src/dataBase";
import {MailEntities} from "@src/dataBase/entities/mail";
import {MailAccountInfo} from "@src/types/ipc";
import {MailPageSizeType} from "@src/types/mail";
import {Like} from "typeorm";

const getMailQueryBuilder = async () => {
    return Database.getRepository(MailEntities)
};

class MailService {

    static async insertMail(mails: MailEntities[]) {
        const mailQueryBuilder = await getMailQueryBuilder();
        for (let i = 0; i < mails.length; i++) {
            const existingEmail = await mailQueryBuilder.findOne({where: {uid: mails[i].uid}});
            if (!existingEmail) {
                await mailQueryBuilder.save(mails[i]).then(() => {
                    console.log("同步到本地邮件:", mails[i].uid)
                })
            }
        }
    }

    static async getMailAllUid({account, type}: MailAccountInfo): Promise<MailEntities[]> {
        const mailQueryBuilder = await getMailQueryBuilder();
        return mailQueryBuilder.find({
            where: {
                account,
                type
            },
            select: ['uid']
        })
    }

    static async getMailList(
        {
            account,
            type,
            pageNo = 2,
            pageSize = 10,
            order = "DESC",
            boxName = "INBOX",
            value,
            isRead
        }: MailAccountInfo & MailPageSizeType & {
            value?: string;
            isRead?: boolean;
            boxName?: string
        }) {
        const mailQueryBuilder = await getMailQueryBuilder();
        const where = [];
        const baseSearch = {
            account,
            type,
            boxName
        }
        if (value) {
            where.push({...baseSearch, subject: Like(`%${value}%`)})
        }
        if (typeof isRead === "boolean") {
            where.push({...baseSearch, isRead})
        }
        if(!value && typeof isRead !== "boolean") {
            where.push({...baseSearch})
        }
        const [list, total] = await mailQueryBuilder.findAndCount({
            where: where,
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                date: order
            }
        })

        return {
            total: total,
            data: list,
            pageNo,
            pageSize,
            order
        }
    }

    static async getMailListCount({account, type}: MailAccountInfo) {
        const mailQueryBuilder = await getMailQueryBuilder();
        return mailQueryBuilder.count({
            where: {
                account,
                type
            }
        })
    }

    // 获取入库的最新的邮件
    static async getLastMail({account, type}: MailAccountInfo) {
        const mailQueryBuilder = await getMailQueryBuilder();
        return mailQueryBuilder
            .findOne({
                where: {
                    account,
                    type
                },
                order: {
                    uid: "DESC"
                }
            })
    }
}

export default MailService;
