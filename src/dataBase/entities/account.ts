import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
import {MailCollectHost, MailCollectPort, MailPlatform} from "@src/types/mail";

@Entity("account")
export class AccountEntities {
    @PrimaryGeneratedColumn("uuid")
    id: string | undefined;

    @Column({type: "text"})
    type: MailPlatform | undefined;

    @Column({type: "text", nullable: true})
    account: string | undefined;

    @Column({type: "text", nullable: true})
    password: string | undefined;

    @Column({type: "text", nullable: true})
    host: MailCollectHost | undefined;

    @Column({type: "text", nullable: true})
    port: MailCollectPort | undefined;

    @CreateDateColumn()
    createTime: Date | undefined;
}

