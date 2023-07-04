import {app} from "electron";

export const isDev = !app.isPackaged;
export const isDebug = process?.argv?.includes?.('--CTPDEV');
export const isMac = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';