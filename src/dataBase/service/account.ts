import Database from "@src/dataBase";
import {AccountEntities} from "@src/dataBase/entities/account";

const getAccountQueryBuilder = async () => {
    return Database.getRepository(AccountEntities)
};

class AccountService {


    static async insertAccount(account: AccountEntities) {
        const accountQueryBuilder = await getAccountQueryBuilder();
        const existingAccount = await accountQueryBuilder.findOne({
            where: {
                account: account.account,
                type: account.type
            }
        });
        if (!existingAccount) {
            await accountQueryBuilder.save(account)
                .then(() => {
                    console.log("新增账号成功: ", JSON.stringify(account))
                })
        }
    }

    static async getAllAccount() {
        const accountQueryBuilder = await getAccountQueryBuilder();
        const list = await accountQueryBuilder.find()
        return list
    }
}

export default AccountService;
