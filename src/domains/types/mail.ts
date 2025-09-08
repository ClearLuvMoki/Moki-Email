export interface MailType {
    id: string
    subject: string
    html: string
    isRead: boolean
    form: { name: string; email: string }[]
    sender: { name: string; email: string }[]
    replyTo: { name: string; email: string }[]
    to: { name: string; email: string }[]
    date: Date
}
