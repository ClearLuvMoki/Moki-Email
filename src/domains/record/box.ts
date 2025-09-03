import { EmailBoxEnum } from "../enum";

export const BoxRecords = {
	Inbox: {
		key: "indox",
		path: "INBOX",
		specialUse: EmailBoxEnum.Inbox,
		flag: EmailBoxEnum.Inbox,
	},
	Sent: {
		key: "sent",
		path: "Sent",
		specialUse: EmailBoxEnum.Sent,
		flag: EmailBoxEnum.Sent,
	},
	Drafts: {
		key: "drafts",
		path: "Drafts",
		specialUse: EmailBoxEnum.Drafts,
		flag: EmailBoxEnum.Drafts,
	},
	Trash: {
		key: "trash",
		path: "Trash",
		specialUse: EmailBoxEnum.Trash,
		flag: EmailBoxEnum.Trash,
	},
	Archive: {
		key: "archive",
		path: "Archive",
		specialUse: EmailBoxEnum.Archive,
		flag: EmailBoxEnum.Archive,
	},
	Junk: {
		key: "junk",
		path: "Junk",
		specialUse: EmailBoxEnum.Junk,
		flag: EmailBoxEnum.Junk,
	},
};
