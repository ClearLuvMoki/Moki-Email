import Database from "@main/database";
import type { CreateEmailDto } from "@main/database/dto";
import { EmailEntities } from "@main/database/entities";

const getEmailQueryBuilder = async () => {
	return Database.getRepository(EmailEntities);
};

const EmailService = {
	getAllEmail() {
		return new Promise(async (resolve, reject) => {
			try {
				const emailQueryBuilder = await getEmailQueryBuilder();
				const existingEmail = await emailQueryBuilder.find();
				resolve(existingEmail);
			} catch (e) {
				reject(e);
			}
		});
	},

	getEmailById(id: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const emailQueryBuilder = await getEmailQueryBuilder();
				const existingEmail = await emailQueryBuilder.findOne({
					where: {
						id,
					},
				});
				resolve(existingEmail || null);
			} catch (e) {
				reject(e);
			}
		});
	},

	createEmail(data: CreateEmailDto) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!data?.email || !data?.password) {
					return reject("邮箱或密码不能为空");
				}
				const emailQueryBuilder = await getEmailQueryBuilder();
				const existingEmail = await emailQueryBuilder.findOne({
					where: {
						email: data.email,
						type: data.type,
					},
				});
				if (!existingEmail) {
					await emailQueryBuilder
						.save(data)
						.then(async () => {
							const findEmail = await emailQueryBuilder.findOne({
								where: {
									email: data.email,
									type: data.type,
								},
							});
							resolve(findEmail);
						})
						.catch(() => {
							console.log("新增邮箱失败: ", JSON.stringify(data));
							reject("新增邮箱失败");
						});
				} else {
					reject("邮箱已存在");
				}
			} catch (e) {
				reject(e);
			}
		});
	},
};

export default EmailService;
