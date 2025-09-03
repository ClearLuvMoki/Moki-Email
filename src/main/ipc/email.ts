import { EmailChannel } from "@domains/channel";
import { EmailService } from "@main/database/service";
import { ipcMain } from "electron";

const EmailIPC = () => {
	ipcMain.handle(EmailChannel.GetAllEmail, () => {
		return EmailService.getAllEmail();
	});

	ipcMain.handle(EmailChannel.GetEmailIdById, (_, { accountId }) => {
		return EmailService.getEmailById(accountId);
	});

	ipcMain.handle(EmailChannel.AddEmail, (_, data: any) => {
		return EmailService.createEmail(data);
	});
};

export default EmailIPC;
