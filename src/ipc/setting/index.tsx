import {BaseWindow, ipcMain, WebContentsView} from "electron";
import {IPCChannel} from "@src/types/ipc";
import {isDev} from "@main/utils/tools";
import path from "path";
import {BaseViewBounds} from "@src/main";
import AccountService from "@src/dataBase/service/account";
import {AccountEntities} from "@src/dataBase/entities/account";

const url: string = isDev
    ? `http://localhost:8086`
    : `file://${path.resolve(__dirname, '../render/setting.ts.html')}`;

const SettingIpc = (MainWindow: BaseWindow) => {
    const SettingView = new WebContentsView({
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            preload: path.resolve(__dirname, "./preload.js")
        }
    })
    SettingView.webContents.loadURL(url);


    ipcMain.handle(IPCChannel.ShowSetting, () => {
        MainWindow.contentView.addChildView(SettingView);
        SettingView.setBounds(BaseViewBounds)
        if (isDev) {
            SettingView.webContents.openDevTools({
                mode: "detach"
            })
        }
    })

    ipcMain.handle(IPCChannel.GetAllAccount, () => {
        return AccountService.getAllAccount()
    })

    ipcMain.handle(IPCChannel.AddAccount, (_, account: AccountEntities) => {
        return AccountService.insertAccount(account)
    })
}

export default SettingIpc;
