import type { EmailBoxEnum } from "../enum";

export interface EmailBoxType {
	key: string;
	name: string;
	specialUse: EmailBoxEnum;
	children: EmailBoxType[];
}
