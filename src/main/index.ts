import {app, BrowserWindow} from "electron"
import path from "path";
import {isDev} from "@/src/main/utils";
import {getConfig} from "@/constant/index"

const dev = getConfig();

let mainWindow: Electron.BrowserWindow = null;

const LoadUrl: string = isDev
    ? `http://localhost:${dev.env.port}`
    : `file://${path.resolve(__dirname, '../renderer/', 'index.html')}`;


const handleCreateWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1072,
        minWidth: 1072,
        height: 730,
        minHeight: 730,
        frame: false,
        useContentSize: true,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(
                __dirname,
                "./preload/index.ts"
            )
        }
    });
    mainWindow.loadURL(LoadUrl);
}

app.whenReady().then(async () => {
    handleCreateWindow();
});