import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {MailPlatform} from "@src/types/mail";

@Entity("mail")
export class MailEntities {
    @PrimaryGeneratedColumn("uuid")
    id: string | undefined;

    @Column({type: "int"})
    uid: number | undefined;

    @Column({type: "boolean"})
    isRead: boolean | undefined;

    @Column({type: "text"})
    type: MailPlatform | undefined;

    @Column({type: "text"})
    boxName: string | undefined;

    @Column({type: "text", nullable: true})
    account: string | undefined;

    @Column({type: "text", nullable: true})
    subject: string | undefined;

    @Column({type: "text", nullable: true})
    fromAddress: string | undefined;

    @Column({type: "text", nullable: true})
    fromName: string | undefined;

    @Column({type: "text", nullable: true})
    toAddress: string | undefined;

    @Column({type: "text", nullable: true})
    toName: string | undefined;

    @Column({type: "date", nullable: true})
    date: string | undefined;

    @Column({type: "text", nullable: true})
    html: string | undefined;

    @Column({type: "text", nullable: true})
    text: string | undefined;
}

