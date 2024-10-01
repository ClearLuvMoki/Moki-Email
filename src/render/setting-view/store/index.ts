import {action, observable, makeAutoObservable} from "mobx"
import {AccountType} from "@src/types/account";
import {RIPCGetAllSetting} from "@render/ripc/setting";


class _Store {
    constructor() {
        makeAutoObservable(this, {
            accountList: observable,
            reloadAccountList: action,
        })
    }


    accountList: AccountType[] = [];
    reloadAccountList = () => {
        RIPCGetAllSetting()
            .then((res) => {
                this.accountList = res || [];
            })
    }


}

const Store = new _Store()
export default Store;
