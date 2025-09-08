import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class MailListDto {
    @IsString({ message: '账号ID必须是字符串!' })
    @IsNotEmpty({ message: '账号ID不能为空!' })
    emailId!: string

    @IsString({ message: '邮箱的文件夹是字符串!' })
    box!: string

    @IsString({ message: '搜索关键词类型必须是字符串!' })
    @IsOptional()
    keyword!: string

    @IsBoolean({ message: '是否已读类型必须是布尔值!' })
    @IsOptional()
    unRead!: boolean

    @IsNumber({}, { message: '页码必须是数字!' })
    @IsOptional()
    pageNo!: number

    @IsNumber({}, { message: '每页条数必须是数字!' })
    @IsOptional()
    pageSize!: number
}
