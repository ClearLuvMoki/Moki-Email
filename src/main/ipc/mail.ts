import { MailChannel } from '@src/domains'
import type { EmailType } from '@src/domains/types'
import { ipcMain } from 'electron'
import type { MailListDto } from '../database/dto'
import { MailService } from '../database/service'
import { MailClientManager } from '../manager'

export let MailClient: MailClientManager | null = null

const MailIPC = () => {
    ipcMain.handle(MailChannel.Init, async (_, account: EmailType) => {
        if (MailClient) {
            await MailClient.logout()
        }
        MailClient = new MailClientManager(account)
        await MailClient.onInit()
        return MailClient?.getBoxes()
    })

    ipcMain.handle(MailChannel.GetBoxes, async () => {
        return MailClient?.getBoxes()
    })

    ipcMain.handle(MailChannel.GetMailList, async (_, data: MailListDto) => {
        return MailService.getMailList(data)
    })

    ipcMain.handle(MailChannel.CheckMails, () => {
        return MailClient?.checkMail()
    })

    ipcMain.handle(MailChannel.ReadMail, (_, { id }: { id: string }) => {
        return MailClient?.readMail(id)
    })

    ipcMain.handle(MailChannel.OpenBox, (_, { box }: { box: string }) => {
        return MailClient?.openBox(box)
    })
}

export default MailIPC
