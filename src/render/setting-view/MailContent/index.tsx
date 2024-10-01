import {memo} from 'react';
import deepEqual from "deep-equal";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card"
import AddMailModal from "./components/AddMailModal";
import {observer} from "mobx-react";
import Store from "@render/setting-view/store";
import dayjs from "dayjs";
import {Label} from "@components/ui/label";

const MailContent = memo(observer(() => {
    const {accountList} = Store;

    return (
        <div>
            <h1 className={"text-2xl font-bold"}>邮箱</h1>
            <div className="my-2">
                <h2 className="text-xxl font-bold mb-2">已配置邮箱</h2>
                <AddMailModal/>
                <div className={"my-2 flex gap-4 flex-wrap"}>
                    {
                        accountList.length === 0 && <span className="text-[#ccc]">暂无数据</span>
                    }
                    {
                        accountList.length > 0 && accountList.map((item, index) => (
                            <Card className="w-[300px]" key={index}>
                                <CardHeader >
                                    <CardTitle>{item.type}</CardTitle>
                                    <CardDescription>{dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}</CardDescription>
                                </CardHeader>
                                <CardContent className={"my-0"}>
                                    <div>
                                        <Label>账号:&nbsp;</Label>
                                        <Label>{item.account}</Label>
                                    </div>
                                    <div>
                                        <Label>密码:&nbsp;</Label>
                                        <Label>{item.password}</Label>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MailContent;
