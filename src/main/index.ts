// import AccountIPC from "@main/ipc/account";
import DataBase from "@main/database";
import { to } from "await-to-js";
import { app, BrowserWindow } from "electron";
import path from "path";
import { AccountIPC, MailIPC } from "./ipc";

export const isDev = !app.isPackaged;
export let mainWindow: BrowserWindow | null = null;

const loadUrl: string = isDev
	? `http://localhost:${process.env.PORT || 8088}`
	: `file://${path.resolve(__dirname, "../render/index.html")}`;

const initIPC = () => {
	AccountIPC();
	MailIPC();
};

const onCreateMainWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		minWidth: 1200,
		height: 800,
		minHeight: 800,
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			webSecurity: false,
			preload: path.resolve(__dirname, "./preload.js"),
		},
	});
	mainWindow.loadURL(loadUrl);
	initIPC();
};

app.on("ready", async () => {
	if (!DataBase.isInitialized) {
		const [err] = await to(DataBase.initialize());
		if (err) {
			console.log("数据库以初始化失败:", err);
		} else {
			console.log("数据库以初始化成功!");
		}
	} else {
		console.log("数据库以初始化成功!");
	}
	onCreateMainWindow();
});
