export enum MailPlatform {
    "QQ" = "QQ",
    "Gmail" = "Gmail",
    "Lank" = "Lank"
}

export enum MailCollectHost {
    "QQ" = "imap.qq.com",
    "Lank" = "imap.feishu.cn",
}

export enum MailCollectPort{
    "QQ" = 993,
    "Lank" = 993
}

export interface MailType {
    id: string;
    uid: number;
    isRead: Boolean;
    type: MailPlatform;
    account: string;
    subject: string | undefined;
    fromAddress: string;
    fromName: string;
    toAddress: string;
    toName: string;
    date: string;
    html: string;
    text: string;
}

export type MailBoxNameType = "INBOX" | "JUNK" |"TRASH"  | "SENT" | "DRAFTS" | "ARCHIVE"


export interface MailPageSizeType {
    pageNo: number;
    pageSize: number;
    data: MailType[];
    total: number;
    order?: "DESC" | "ASC";
    boxName?: string
}


export interface MailBoxType {
    name: string;
    type?: MailBoxNameType;
}

