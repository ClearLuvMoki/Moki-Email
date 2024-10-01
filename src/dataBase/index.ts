import {join} from "path";
import {DataSource} from "typeorm";
import {app} from "electron";
import {MailEntities} from "@src/dataBase/entities/mail";
import {AccountEntities} from "@src/dataBase/entities/account";


const dataBasePath = join(
    app.getPath("appData"),
    app.getName(),
    `./MokiMailDatabase/index.db`
);

const DataBase = new DataSource({
    type: "better-sqlite3",
    entities: [MailEntities, AccountEntities],
    database: dataBasePath,
    synchronize: true,
    logging: ["error"],
    nativeBinding: join(__dirname, "./better_sqlite3.node")
})


export default DataBase;
