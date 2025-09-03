import { MailPlatformEnum } from "@domains/enum/email";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("email")
export class EmailEntities {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({ type: "text", enum: MailPlatformEnum })
	public type!: MailPlatformEnum;

	@Column({ type: "text", nullable: true })
	public email!: string;

	@Column({ type: "text", nullable: true })
	public password!: string;

	@Column({ type: "text", nullable: true })
	public host!: string;

	@Column({ type: "text", nullable: true })
	public port!: number;

	@CreateDateColumn()
	public createTime!: Date;
}
