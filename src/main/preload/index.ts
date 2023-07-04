import {contextBridge} from 'electron';

contextBridge.exposeInMainWorld('IPC', {});
