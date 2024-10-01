import {ipcMain, WebContents} from "electron"
import {IPCChannel, MailAccountInfo} from "@src/types/ipc";
import MailService from "@src/dataBase/service/mail";
import {MailPageSizeType} from "@src/types/mail";
import {MainWindow} from "@src/main";


const MailIpc = () => {
    ipcMain.handle(IPCChannel.MailListByType, (_, data: MailAccountInfo & MailPageSizeType & {
        value?: string;
        isRead?: boolean
    }) => {
        return MailService.getMailList(data)
    })

    ipcMain.handle(IPCChannel.GetViewId, (event) => {
        return event.frameId
    })

};

export default MailIpc;
