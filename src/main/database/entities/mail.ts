import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("mails")
export class MailEntities {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({ type: "int" })
	uid?: number;

	@Column({ type: "boolean", default: false })
	public isRead!: boolean;

	@Column({ type: "text", default: "" })
	public boxPath!: string;

	@Column({ type: "text", default: "" })
	public subject?: string;

	@Column({ type: "text", default: "" })
	public emailId!: string;

	@Column({ type: "blob", nullable: true })
	public source!: any;

	@Column({ type: "simple-json", nullable: true })
	public status!: string[];

	@Column({ type: "simple-json", nullable: true })
	public form!: string[];

	@Column({ type: "simple-json", nullable: true })
	public sender!: string[];

	@Column({ type: "simple-json", nullable: true })
	public replyTo!: string[];

	@Column({ type: "simple-json", nullable: true })
	public to!: string[];

	@Column({ type: "simple-json", nullable: true })
	public attachments!: string[];

	@Column({ type: "datetime", nullable: true })
	public date!: Date;

	@CreateDateColumn()
	public createTime!: Date;
}
