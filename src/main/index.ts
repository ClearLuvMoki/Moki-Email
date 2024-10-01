import {app, BaseWindow, WebContentsView} from 'electron';
import path from 'path';
import {isDev} from '@main/utils/tools';
import Mail from "@src/ipc/mail";
import DataBase from "@src/dataBase";
import to from "await-to-js";
import MailIpc from "@src/ipc/mail/ipc";
import SettingIpc from "@src/ipc/setting";
import AccountService from "@src/dataBase/service/account";

export let MainWindow: BaseWindow | null = null;
let SidebarView: WebContentsView | null = null;

export const BaseViewBounds = {
    x: 0,
    y: 50,
    width: 1072,
    height: 738
}


const initIPC = (
    {
        MainWindow,
    }: {
        MainWindow: BaseWindow,
    }) => {
    MailIpc();
    SettingIpc(MainWindow);
}


const loadSidebarUrl: string = isDev
    ? `http://localhost:8087`
    : `file://${path.resolve(__dirname, '../render/sidebar-view.html')}`;

const handleCreateMainWindow = () => {
    MainWindow = new BaseWindow({
        width: 1072,
        minWidth: 1072,
        height: 778,
        minHeight: 778,
        frame: false,
        resizable: true,
        titleBarStyle: "hiddenInset",
        trafficLightPosition: {x: 15, y: 15}
    })
    SidebarView = new WebContentsView({
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            preload: path.resolve(__dirname, "./preload.js")
        }
    });

    MainWindow.contentView.addChildView(SidebarView);

    SidebarView.webContents.loadURL(loadSidebarUrl);

    SidebarView.setBounds({
        x: 0, y: 0, width: 1072, height: 50,
    })

    MainWindow.on("resize", () => {
        const bounds = MainWindow?.getBounds();
        SidebarView?.setBounds({
            x: 0, y: 0, width: bounds?.width || 1072, height: 50,
        })
    })
    initIPC({
        MainWindow,
    });


    // 获取配置的邮箱列表,并且实例化第一个
    AccountService.getAllAccount()
        .then((res) => {
            const arr = res.map((item: any) => {
                return new Mail({
                    baseWindow: MainWindow as any,
                    mailType: item.type,
                    config: {
                        user: item.account,
                        password: item.password,
                        host: item.host,
                        port: item.port || 993,
                        tls: true,
                        tlsOptions: {rejectUnauthorized: false},
                    }
                })
            })

            console.log(arr.map(item => item.view?.webContents.id), 'MainWindow?.getChildWindows().length')

            // const data = res?.[0] as any;
            // if (data && MainWindow) {
            //     console.log(data, 'data')
            //
            // }
        })


}


app.on('ready', async () => {
    if (!DataBase.isInitialized) {
        const [err] = await to(DataBase.initialize());
        if (err) {
            console.log("数据库以初始化失败!")
        } else {
            console.log("数据库以初始化成功!")
        }
    } else {
        console.log("数据库以初始化成功!")
    }
    handleCreateMainWindow();
});
