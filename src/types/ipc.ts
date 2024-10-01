import {MailPlatform, MailType} from "@src/types/mail";

export enum IPCChannel {
    // View
    GetViewId = "get:view-id",
    // Mail
    GetMailAccountInfo = "get:mail-account-info",
    GetMailSynchronizeStatus = "get:mail-sync-status",
    MailListByType = "notice:mail-list-by-type",
    MailError = "notice:mail-error",
    CheckNewMail = "notice:check-new-mail",
    MailBoxList = "notice:get-mail-box-list",
    CheckInitMailReady = "notice:check-init-mail-ready",
    ChangeMailAccount = "notice:change-mail-account",

    // Setting
    ShowSetting = "notice:show-setting",
    GetAllAccount = "notice:get-all-account",
    AddAccount = "notice:add-account"
}


export interface MailError {
    type: MailPlatform,
    message: string;
    user: string;
}


export interface MailAccountInfo {
    account: MailType['account'];
    type: MailType['type']
}

