import {IPCChannel} from "@src/types/ipc";
import {AccountType} from "@src/types/account";

export const RIPCShowSetting = () => {
    try {
        return window.IPC.invoke(IPCChannel.ShowSetting)
    } catch (_) {
        return Promise.resolve()
    }
}

// 获取所有的配置邮件
export const RIPCGetAllSetting = () => {
    try {
        return window.IPC.invoke(IPCChannel.GetAllAccount)
    } catch (_) {
        return Promise.resolve()
    }
}

// 获取所有的配置邮件
export const RIPCAddAccount = (account: Omit<Omit<AccountType, "createTime">, "id">) => {
    try {
        return window.IPC.invoke(IPCChannel.AddAccount, account)
    } catch (_) {
        return Promise.resolve()
    }
}
