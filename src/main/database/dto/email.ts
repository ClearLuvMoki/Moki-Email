import type { MailPlatformEnum } from "@domains/enum/email";
import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateEmailDto {
	@IsString({ message: "邮箱类型错误!" })
	@IsNotEmpty({ message: "邮箱类型不能为空!" })
	type!: MailPlatformEnum;

	@IsString({ message: "邮箱Host错误!" })
	@IsOptional({ message: "邮箱Host不能为空!" })
	host!: string;

	@IsNumber({}, { message: "邮箱Port错误!" })
	@IsOptional({ message: "邮箱Port不能为空!" })
	port!: number;

	@IsEmail(undefined, { message: "请输入正确的邮箱地址" })
	@IsString({ message: "邮箱账号类型错误!" })
	@IsNotEmpty({ message: "邮箱账号不能为空!" })
	email!: string;

	@IsString({ message: "用户密码类型错误!" })
	@IsNotEmpty({ message: "用户密码不能为空!" })
	password!: string;
}
