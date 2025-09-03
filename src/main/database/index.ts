import { app } from "electron";
import { join } from "path";
import { DataSource } from "typeorm";
import { ContactEntities, EmailEntities, MailEntities } from "./entities";

const dataBasePath = join(
	app.getPath("appData"),
	app.getName(),
	`./moki-email/index.db`,
);

console.log(dataBasePath, "dataBasePath");

const DataBase = new DataSource({
	type: "better-sqlite3",
	entities: [EmailEntities, MailEntities, ContactEntities],
	database: dataBasePath,
	synchronize: true,
	logging: ["error"],
	nativeBinding: join(__dirname, "./better_sqlite3.node"),
});

export default DataBase;
