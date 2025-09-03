import { MailPlatformEnum, MailRecords } from "@src/domains";
import { EmailChannel, MailChannel } from "@src/domains/channel";
import { useState } from "react";
import { Button } from "./components/ui/button";

const Card = ({
	data,
	setData,
	text,
}: {
	data: string;
	setData: () => void;
	text: string;
}) => {
	return (
		<div style={{ margin: "10px 0" }}>
			<div>{data}</div>
			<button onClick={setData}>{text}</button>
		</div>
	);
};

const App = () => {
	const [data, setData] = useState("");
	const [box, setBox] = useState("");
	const [mails, setMails] = useState("");
	const onAccountList = () => {
		window.IPC.invoke(EmailChannel.GetAllEmail).then((res: any) =>
			setData(JSON.stringify(res)),
		);
	};

	const onCreateAccount = () => {
		window.IPC.invoke(EmailChannel.AddEmail, {
			email: "2893096286@qq.com",
			password: "lswlsjzknhcudhcg",
			type: MailPlatformEnum.QQ,
			host: MailRecords[MailPlatformEnum.QQ].host,
			port: MailRecords[MailPlatformEnum.QQ].port,
		}).then((res: any) => onAccountList());
	};

	const onInitMail = async () => {
		const res = await window.IPC.invoke(EmailChannel.GetAllEmail);
		window.IPC.invoke(MailChannel.Init, res?.[0])
			.then(console.log)
			.catch(console.error);
	};

	const onGetMailBox = async () => {
		window.IPC.invoke(MailChannel.GetBoxes)
			.then((res) => {
				setBox(JSON.stringify(res));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onGetMails = async () => {
		const res = await window.IPC.invoke(EmailChannel.GetAllEmail);
		window.IPC.invoke(MailChannel.GetMailList, {
			emailId: res?.[0]?.id,
			pageNo: 1,
			keyword: "",
			pageSize: 100,
		})
			.then((res) => {
				setMails(JSON.stringify(res));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<Button>1221</Button>
		</div>
	);
};

export default App;
