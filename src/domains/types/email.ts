import type { MailPlatformEnum } from "../enum/email";

export interface EmailType {
	id: string;
	email: string;
	password: string;
	host: string;
	port: number;
	type: MailPlatformEnum;
}
