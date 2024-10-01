import {IPCChannel, MailAccountInfo} from "@src/types/ipc";
import {MailBoxType, MailPageSizeType, MailPlatform, MailType} from "@src/types/mail";


// 根据账号以及账号的平台获取邮件数据
export const RIPCGetMailListByType = (data: MailAccountInfo & Partial<MailPageSizeType> & {
    value?: string;
    isRead?: boolean
}): Promise<MailPageSizeType> => {
    const errData = {
        data: [],
        pageNo: 1,
        pageSize: 10,
        total: 0
    }
    try {
        if (!data.account) return Promise.resolve(errData);
        return window.IPC.invoke(IPCChannel.MailListByType, data)
    } catch (_) {
        return Promise.resolve(errData)
    }
}

// 获取当前View中的账号以及平台信息
export const RIPCGetAccountInfo = (): Promise<MailAccountInfo> => {
    try {
        return window.IPC.invoke(IPCChannel.GetMailAccountInfo)
    } catch (_) {
        return Promise.resolve({
            account: "",
            type: MailPlatform.QQ
        })
    }
}

// 获取当前邮件同步的进度
export const RIPCGetSynchronizeStatus = (data: MailAccountInfo): Promise<{ ready: number; total: number }> => {
    try {
        return window.IPC.invoke(IPCChannel.GetMailSynchronizeStatus, {
            account: data.account,
            type: data.type
        })
    } catch (_) {
        return Promise.resolve({
            ready: 1,
            total: 1
        })
    }
}

// 监听获取当前的新邮件
export const RIPCGetNewMail = (): Promise<MailType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.CheckNewMail)
    } catch (_) {
        return Promise.resolve([])
    }
}

// 邮件初始化完成的反馈
export const RIPCMailInitReady = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
                const result = await window.IPC.invoke(IPCChannel.CheckInitMailReady);
                if (result) {
                    resolve(result); // 如果结果为true，直接返回
                    return;
                }
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise(r => setTimeout(r, 1000)); // 延迟1秒
                }
            }
        } catch (err) {
            reject(err)
        }
    })
}

// 主动获取当前服务器的邮箱所有文件夹
export const RIPCGetMailBoxes = (): Promise<MailBoxType[]> => {
    try {
        return window.IPC.invoke(IPCChannel.MailBoxList)
    } catch (_) {
        return Promise.resolve([])
    }
}


