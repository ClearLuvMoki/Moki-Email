import { MailPlatformEnum } from "../enum/email";

export const MailRecords = {
	QQ: {
		type: MailPlatformEnum.QQ,
		port: 993,
		host: "imap.qq.com",
	},
	Lark: {
		type: MailPlatformEnum.Lark,
		port: 993,
		host: "imap.feishu.com",
	},
};
