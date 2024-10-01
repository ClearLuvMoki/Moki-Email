import {makeAutoObservable} from "mobx"


class _Store {
    constructor() {
        makeAutoObservable(this, {
        })
    }

}

const Store = new _Store()
export default Store;
