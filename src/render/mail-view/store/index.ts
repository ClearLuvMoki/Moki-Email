import {action, observable, makeAutoObservable} from "mobx"
import {MailAccountInfo} from "@src/types/ipc";
import {MailBoxType, MailPageSizeType, MailPlatform, MailType} from "@src/types/mail";
import {RIPCGetMailListByType} from "@render/ripc/mail";
import {AccountType} from "@src/types/account";
import {RIPCGetAllSetting} from "@render/ripc/setting";


class _Store {
    constructor() {
        makeAutoObservable(this, {
            isCollapsedSide: observable, // 折叠面板
            updateIsCollapsedSide: action,
            mailAccountInfo: observable,
            updateMailAccountInfo: action,
            activeBox: observable,
            updateActiveBox: action,
            boxList: observable,
            updateBoxList: action,
            mailList: observable,
            updateMailList: action,
            selectMail: observable,
            updateSelectMail: action,
            paginationState: observable,
            updatePaginationState: action,
            searchParams: observable,
            updateSearchParams: action,
            activeAccount: observable,
            updateActiveAccount: action,
            accountList: observable,
            reloadAccountList: action,
        })
    }

    isCollapsedSide: boolean = false;
    updateIsCollapsedSide = (isCollapsed: boolean) => {
        this.isCollapsedSide = isCollapsed;
    }

    searchParams = {
        value: "",
        isRead: false
    }

    updateSearchParams = (params: {
        value?: string;
        isRead?: boolean;
    }) => {
        this.searchParams = {
            ...this.searchParams,
            ...params
        }
        this.handleReloadList({
            boxName: this.activeBox?.name || "INBOX",
            ...this.mailAccountInfo,
            ...this.paginationState,
            value: params?.value || "",
            isRead: params?.isRead
        });
    }

    mailAccountInfo: MailAccountInfo = {
        account: "",
        type: MailPlatform.QQ
    }

    updateMailAccountInfo = (info: Partial<MailAccountInfo>) => {
        this.mailAccountInfo = {
            ...this.mailAccountInfo,
            ...info
        }
        this.handleReloadList({
            boxName: this.activeBox?.name || "INBOX",
            ...this.mailAccountInfo,
            ...this.paginationState
        });
    }

    paginationState: {
        pageNo: number;
        pageSize: number;
        total: number;
        order?: "ASC" | "DESC"
    } = {
        pageNo: 1,
        pageSize: 80,
        total: 0,
        order: "DESC"
    }
    updatePaginationState = (page: Omit<Partial<MailPageSizeType>, "data">) => {
        this.paginationState = {
            ...this.paginationState,
            ...page
        }
        this.handleReloadList({
            boxName: this.activeBox?.name || "INBOX",
            ...this.mailAccountInfo,
            ...this.paginationState
        });
    }

    selectMail: MailType | null = null;
    updateSelectMail = (mail: MailType | null) => {
        this.selectMail = mail
    }

    activeBox: MailBoxType | null = null
    updateActiveBox = (box: MailBoxType) => {
        this.activeBox = box;
        this.handleReloadList({
            boxName: this.activeBox?.name || "INBOX",
            ...this.mailAccountInfo,
            ...this.paginationState
        });
    }

    boxList: MailBoxType[] = [];
    updateBoxList = (list: MailBoxType[]) => {
        this.boxList = list
    }

    mailList: MailType[] = [];
    updateMailList = (list: MailType[]) => {
        this.mailList = list;
    }

    handleReloadList = (params: MailAccountInfo & Omit<Partial<MailPageSizeType>, "data"> & {
        value?: string;
        isRead?: boolean;
    }) => {
        RIPCGetMailListByType(params)
            .then((res) => {
                this.updateMailList(res.data || [])
                this.paginationState = {
                    pageNo: res.pageNo,
                    pageSize: res.pageSize,
                    total: res.total,
                    order: res.order
                }
            })
    };

    activeAccount: AccountType | null = null;
    updateActiveAccount = (account: AccountType | null) => {
        this.activeAccount = account;
    }


    accountList: AccountType[] = [];
    reloadAccountList = () => {
        RIPCGetAllSetting()
            .then((res) => {
                this.activeAccount = res?.[0]
                this.accountList = res || [];
            })
    }

}

const Store = new _Store()
export default Store;
