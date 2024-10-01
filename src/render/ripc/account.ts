import {IPCChannel, MailAccountInfo} from "@src/types/ipc";

export const RIPCAccountSelect = (account: MailAccountInfo) => {
    try {
        return window.IPC.invoke(IPCChannel.ChangeMailAccount, account)
    } catch (_) {
        return Promise.resolve()
    }
}
