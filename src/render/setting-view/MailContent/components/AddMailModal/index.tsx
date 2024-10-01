import {memo, useState} from 'react';
import deepEqual from "deep-equal";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog";
import {Button} from "@components/ui/button";
import {Input} from "@components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {MailCollectHost, MailPlatform, MailCollectPort} from "@src/types/mail";
import {RIPCAddAccount} from "@render/ripc/setting";
import Store from "@render/setting-view/store";
import {toast} from "sonner";

const MailType: { label: string; value: MailPlatform, host: MailCollectHost, port: MailCollectPort }[] = [
    {label: "QQ", value: MailPlatform.QQ, host: MailCollectHost.QQ, port: MailCollectPort.QQ},
    {label: "飞书", value: MailPlatform.Lank, host: MailCollectHost.Lank, port: MailCollectPort.Lank},
    // {label: "谷歌邮箱", value: MailPlatform.Gmail,},
    // {label: "网易", value: "163"},
]

//6nQrimcrcs0hgqHD
// xunanfeng@catalystplus.cn
const FormSchema = z.object({
    type: z
        .string({
            required_error: "请选择一个邮箱平台.",
        }),
    account: z
        .string({
            required_error: "请输入账号.",
        }),
    password: z
        .string({
            required_error: "请输入平台专用密码.",
        })
})

const AddMailModal = memo(() => {
    const {reloadAccountList} = Store;
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })


    const onSubmit = (values: any) => {
        const mail = MailType.find(item => item.value === values.type);
        RIPCAddAccount({
            account: values.account,
            password: values.password,
            type: values.type,
            host: mail?.host as MailCollectHost,
            post: mail?.port as MailCollectPort,
        })
            .then(() => {
                toast.success("新增成功!", {
                    duration: 3000
                })
                form.reset();
                form.clearErrors()
                setOpen(false);
                reloadAccountList();
            })
            .catch(() => {
                form.reset();
                form.clearErrors()
                toast.error("新增失败!", {
                    duration: 3000
                })
            })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => setOpen(true)}
                >新增邮箱</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>新增邮箱</DialogTitle>
                    <DialogDescription>
                        请选择您需要新增的邮箱，并且配置您的邮箱
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...form}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => {
                                    return <FormItem className="grid grid-cols-4 items-center gap-1">
                                        <FormLabel className="text-right col-span-1">邮箱平台</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="col-span-3 ">
                                                <SelectTrigger className="col-span-3 !mt-0">
                                                    <SelectValue placeholder="请选择一个平台"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        MailType.map(item => (
                                                            <SelectItem key={item.value}
                                                                        value={item.value}>{item.label}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className={"col-start-2 col-span-3"}/>
                                    </FormItem>
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="account"
                                render={({field}) => {
                                    return <FormItem className="grid grid-cols-4 items-center gap-1">
                                        <FormLabel className="text-right col-span-1">账户</FormLabel>
                                        <FormControl className="col-span-3 ">
                                            <Input className="col-span-3 !mt-0" {...field}/>
                                        </FormControl>
                                        <FormMessage className={"col-start-2 col-span-3"}/>
                                    </FormItem>
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => {
                                    return <FormItem className="grid grid-cols-4 items-center gap-1">
                                        <FormLabel className="text-right col-span-1">专用密码</FormLabel>
                                        <FormControl className="col-span-3 ">
                                            <Input className="col-span-3 !mt-0" {...field}/>
                                        </FormControl>
                                        <FormMessage className={"col-start-2 col-span-3"}/>
                                    </FormItem>
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">保存</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default AddMailModal;
