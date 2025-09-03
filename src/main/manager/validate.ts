import { type ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { type Source, simpleParser } from "mailparser";
import { async } from "./../../../node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/scheduler/async";

export class MailToolManager {
	static async validate<T, D>(inputDTO: ClassConstructor<T>, input: D) {
		const dto = plainToInstance(inputDTO, input);
		const errors = await validate(dto as any, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});
		return errors;
	}
	static parseMail(source: Source) {
		return new Promise((resolve, reject) => {
			try {
				if (!source) {
					reject();
				}
				simpleParser(source, (err, mail) => {
					if (err) {
						reject(err);
					}
					resolve(mail);
				});
			} catch (err) {
				reject(err);
			}
		});
	}
	static async transformMailContent(source: Blob) {
		return MailToolManager.parseMail((source || "") as any);
	}
}
