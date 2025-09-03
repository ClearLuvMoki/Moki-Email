import { EmailChannel, MailChannel } from "@src/domains";
import type { EmailBoxType, EmailType, MailType } from "@src/domains/types";
import { create } from "zustand";

interface State {
	collapse: boolean;
	setCollapse: (collapse: boolean) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	listLoading: boolean;
	setListLoading: (loading: boolean) => void;
	menu: EmailBoxType[];
	setMenu: (menu: EmailBoxType[]) => void;
	paginationState: {
		total: number;
		pageNo: number;
		pageSize: number;
	};
	setPaginationState: (state: {
		pageNo: number;
		pageSize: number;
		total: number;
	}) => void;
	mails: MailType[];
	setMails: (mails: MailType[]) => void;
	selectMail: MailType | null;
	setSelectMail: (mail: MailType | null) => void;
	reloadMail: ({
		keyword,
		pageNo,
		pageSzie,
	}: {
		keyword?: string;
		pageNo?: number;
		pageSzie?: number;
	}) => void;
}

export const useStore = create<State>((set, get) => {
	window.IPC.invoke<EmailType[]>(EmailChannel.GetAllEmail)
		.then((res) => {
			const data = res?.[0];
			if (data?.id) {
				return window.IPC.invoke(
					MailChannel.Init,
					data as Partial<EmailType>,
				).then(() => {
					window.IPC.invoke(MailChannel.CheckMails);
					Promise.allSettled([
						window.IPC.invoke<EmailBoxType[]>(MailChannel.GetBoxes),
						window.IPC.invoke<MailType[]>(MailChannel.GetMailList, {
							emailId: data?.email,
							pageNo: get().paginationState?.pageNo,
							pageSize: get().paginationState?.pageSize,
						}),
					])
						.then((res) => {
							const box = (res?.[0] as any).value;
							const mailsData = (res?.[1] as any).value;
							console.log(mailsData, "mailsData");
							set({
								menu: box,
								mails: mailsData?.data,
								paginationState: {
									total: mailsData?.total,
									pageNo: mailsData?.pageNo,
									pageSize: mailsData?.pageSize,
								},
							});
						})
						.catch(console.log);
					return window.IPC.invoke<EmailBoxType[]>(MailChannel.GetBoxes).then(
						(boxes) => {
							set({ menu: boxes });
						},
					);
				});
			}
			return Promise.resolve();
		})
		.finally(() => set({ loading: false }));

	return {
		collapse: false,
		setCollapse: (collapse: boolean) =>
			set({
				collapse,
			}),
		loading: true,
		setLoading: (loading: boolean) =>
			set({
				loading,
			}),
		listLoading: false,
		setListLoading: (loading: boolean) => set({ listLoading: loading }),
		menu: [],
		setMenu: (menu: EmailBoxType[]) => set({ menu }),

		mails: [],
		setMails: (mails: MailType[]) => set({ mails }),
		selectMail: null,
		setSelectMail: (mail: MailType | null) => set({ selectMail: mail }),
		reloadMail: ({
			keyword,
			pageNo,
			pageSzie,
		}: {
			keyword?: string;
			pageNo?: number;
			pageSzie?: number;
		}) => {
			set({ listLoading: true });
			return window.IPC.invoke<{
				data: MailType[];
				pageNo: number;
				pageSize: number;
				total: number;
			}>(MailChannel.GetMailList, {
				emailId: "2893096286@qq.com",
				keyword: keyword || "",
				pageNo: pageNo || get().paginationState?.pageNo,
				pageSize: pageSzie || get().paginationState?.pageSize,
			})
				.then((res) => {
					set({
						mails: [...get().mails, ...res?.data],
						paginationState: {
							pageNo: res?.pageNo || get().paginationState?.pageNo,
							pageSize: res?.pageSize || get().paginationState?.pageSize,
							total: res?.total || get().paginationState?.total,
						},
					});
				})
				.finally(() => set({ listLoading: false }));
		},
		paginationState: {
			pageNo: 1,
			pageSize: 50,
			total: 0,
		},
		setPaginationState: (state: {
			pageNo: number;
			pageSize: number;
			total: number;
		}) => set({ paginationState: state }),
	};
});
