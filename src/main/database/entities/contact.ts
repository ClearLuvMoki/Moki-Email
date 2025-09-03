import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("contact")
export class ContactEntities {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({ type: "text", default: "" })
	public name!: string;

	@Column({ type: "text", default: "" })
	public email!: string;

	@CreateDateColumn()
	public createTime!: Date;
}
