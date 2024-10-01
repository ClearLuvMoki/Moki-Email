import {MailCollectHost, MailCollectPort, MailPlatform} from "@src/types/mail";

export interface AccountType {
    id: string;
    account: string;
    type: MailPlatform;
    host: MailCollectHost;
    post: MailCollectPort;
    password: string;
    createTime: string;
}
