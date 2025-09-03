import Database from "@main/database";
import { MailToolManager } from "@src/main/manager";
import { MailListDto } from "../dto";
import { EmailEntities, MailEntities } from "../entities";

const getEmailQueryBuilder = async () => {
	return Database.getRepository(EmailEntities);
};

const getMailQueryBuilder = async () => {
	return Database.getRepository(MailEntities);
};

const MailService = {
	getMailList(data: MailListDto) {
		return new Promise(async (resolve, reject) => {
			try {
				const error = await MailToolManager.validate(MailListDto, data);
				if (error?.length > 0) {
					console.log(JSON.stringify(error));
					return reject("参数错误");
				}
				const pageNo = data.pageNo || 1;
				const pageSize = data.pageSize || 10;
				const skip = (pageNo - 1) * pageSize;

				const emailBuilder = await getEmailQueryBuilder();
				const email = await emailBuilder.findOne({
					where: {
						email: data.emailId,
					},
				});
				if (!email) {
					return resolve({
						data: [],
						total: 0,
						pageNo: data.pageNo || pageNo,
						pageSize: data.pageSize || pageSize,
					});
				}
				const mailBuilder = await getMailQueryBuilder();
				const qb = mailBuilder.createQueryBuilder("mail");

				qb.where("mail.emailId = :emailId", { emailId: data.emailId });

				if (data?.keyword) {
					// qb.andWhere("(mail.subject LIKE :kw OR mail.html LIKE :kw)", {
					qb.andWhere("(mail.subject LIKE :kw)", {
						kw: `%${data.keyword}%`,
					});
				}
				qb.orderBy("mail.date", "DESC").skip(skip).take(pageSize);
				const mails = await qb.getMany();
				const mailList = await Promise.allSettled(
					mails.map(async (item) => {
						const source: any = await MailToolManager.transformMailContent(
							item.source,
						);
						return {
							...item,
							html: source?.html || source?.textAsHtml || source?.html,
						};
					}),
				);
				const total = await qb.getCount();
				return resolve({
					data:
						(mailList.filter((item) => item.status === "fulfilled") as any).map(
							(item: any) => item.value,
						) || [],
					total: total,
					pageNo: pageNo,
					pageSize: pageSize,
				});
			} catch (err) {
				reject(err);
			}
		});
	},
};

export default MailService;
