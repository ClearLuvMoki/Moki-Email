import {memo, useEffect} from 'react';
import deepEqual from "deep-equal";
import {
    Inbox,
    File,
    Send,
    ArchiveX, LucideIcon, Ban,
    Trash2, Archive
} from "lucide-react"
import {observer} from "mobx-react"
import Nav from "./components/Nav";
import Store from "@render/mail-view/store";
import {Separator} from "@components/ui/separator";
import {cn} from "@render/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select";
import Tools from "@render/utils/tools";
import {MailBoxNameType, MailPlatform} from "@src/types/mail";
import {RIPCAccountSelect} from "@render/ripc/account";

const handleUniteName = (type: MailBoxNameType): { title: string, icon: LucideIcon } => {
    switch (type) {
        case "INBOX": {
            return {
                title: "Inbox",
                icon: Inbox
            }
        }
        case "SENT": {
            return {
                title: "Sent",
                icon: Send
            }
        }
        case "DRAFTS": {
            return {
                title: "Drafts",
                icon: File
            }
        }
        case "JUNK": {
            return {
                title: "Junk",
                icon: ArchiveX
            }
        }
        case "TRASH": {
            return {
                title: "Trash",
                icon: Trash2
            }
        }
        case "ARCHIVE": {
            return {
                title: "Archive",
                icon: Archive
            }
        }
        default: {
            return {
                title: "未知名称",
                icon: Ban
            }
        }
    }
}

const Sidebar = memo(observer(() => {
    const {
        isCollapsedSide,
        boxList,
        activeBox,
        updateActiveBox,
        activeAccount,
        updateActiveAccount,
        accountList,
        reloadAccountList
    } = Store;

    useEffect(() => {
        reloadAccountList();
    }, [])

    return (
        <div>
            <div
                className={cn(
                    "flex h-[44px] items-center justify-center",
                    isCollapsedSide ? "h-[44px]" : "px-2"
                )}
            >
                <Select
                    value={JSON.stringify(activeAccount)}
                    onValueChange={(item) => {
                        const account = JSON.parse(item || "{}");
                        RIPCAccountSelect(account);
                        updateActiveAccount(account)
                    }}
                >
                    <SelectTrigger
                        className={cn(
                            "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:shrink-0",
                            isCollapsedSide &&
                            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                        )}
                        aria-label="Select account"
                    >
                        <SelectValue placeholder="Select an account">
                            {Tools.GetMailIconByType(activeAccount?.type as MailPlatform, "text-2xl")}
                            <span className={cn("ml-1", isCollapsedSide && "hidden")}>
                            {
                                accountList.find((item) => item.account === activeAccount?.account && item.type === activeAccount.type)
                                    ?.type
                            }
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {accountList.map((item) => (
                            <SelectItem key={item.account} value={JSON.stringify(item)}>
                                <div
                                    className="flex items-center gap-3 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                    {Tools.GetMailIconByType(item?.type as MailPlatform, "text-2xl")}
                                    {item.account}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator/>
            <Nav
                isCollapsed={isCollapsedSide}
                links={(boxList || []).map(item => {
                    const data = handleUniteName(item.type || "INBOX") || {}
                    return {
                        title: data?.title,
                        icon: data?.icon,
                        variant: activeBox?.name === item.name ? "default" : "ghost"
                    }
                })}
                onClick={(index) => {
                    updateActiveBox(boxList[index])
                }}
            />
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default Sidebar;
