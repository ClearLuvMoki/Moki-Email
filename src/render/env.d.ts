/// <reference types="@rsbuild/core/types" />
import type { IpcRenderer, IpcRendererEvent } from "electron";

declare global {
	interface Window {
		IPC: {
			invoke: <T>(channel: string, data?: any) => Promise<T>;
			ipcOn: (
				channel: string,
				fun: (event: IpcRendererEvent, data: any) => void,
			) => IpcRenderer;
			removeAllListeners: (channel: string) => IpcRenderer;
		};
	}
}
