import {memo, useEffect, useState} from 'react';
import deepEqual from "deep-equal";
import {useInterval} from "ahooks";
import {ScrollArea} from "@components/ui/scroll-area"
import {Progress} from "@components/ui/progress"
import {observer} from "mobx-react";
import Store from "@render/mail-view/store";
import {RIPCGetSynchronizeStatus} from "@render/ripc/mail";
import MailCard from "./components/MailCard";
import {Separator} from "@components/ui/separator";
import {ArrowDownNarrowWide, ArrowUpNarrowWide, Search} from "lucide-react";
import {Input} from "@components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@components/ui/pagination";
import {cn} from "@render/utils";
import {
    Menubar, MenubarCheckboxItem,
    MenubarContent,
    MenubarMenu,
    MenubarTrigger
} from "@components/ui/menubar";

const MailList = memo(observer(() => {
    const {
        mailAccountInfo,
        mailList,
        activeBox,
        paginationState,
        updatePaginationState,
        updateSearchParams
    } = Store;
    const [progress, setProgress] = useState<number>(100);

    const clearInterval = useInterval(() => {
        RIPCGetSynchronizeStatus(mailAccountInfo)
            .then((res) => {
                setProgress((res.ready / res.total) * 100)
            })
    }, 2000)

    useEffect(() => {
        if (progress == 100 && clearInterval) {
            clearInterval()
        }
    }, [progress, clearInterval])


    const handleSearch = (value: string) => {
        updateSearchParams({
            value
        })
    }

    const handleChangePagination = (type: "last" | "next" | "order", value?: any) => {
        const {pageNo, pageSize, total} = paginationState
        switch (type) {
            case "next": {
                if ((pageNo) * pageSize > total) return;
                updatePaginationState({
                    pageNo: pageNo + 1,
                })
                break;
            }
            case "last": {
                updatePaginationState({
                    pageNo: pageNo > 1 ? pageNo - 1 : 1,
                })
                break;
            }
            case "order": {
                updatePaginationState({
                    pageNo: 1,
                    order: value
                })
                break
            }
        }
    }


    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-2 justify-between h-[44px]">
                <h1 className="text-xl font-bold">
                    {activeBox?.type}
                </h1>
                <div className={"flex items-center "}>
                    <Menubar
                        className={"border-none shadow-none"}
                    >
                        <MenubarMenu>
                            <MenubarTrigger className={"border-none"}>
                            <span className={cn('text-xs select-none cursor-pointer ')}>
                                <span>{`第 
                                ${(paginationState.pageNo - 1) * paginationState.pageSize} 
                                - ${Math.min((paginationState.pageNo - 1) * paginationState.pageSize + paginationState.pageSize, paginationState.total)}
                                行`}</span>&nbsp;
                                <span>{`共: ${paginationState.total || 0}`}</span>
                            </span>
                            </MenubarTrigger>
                            <MenubarContent autoFocus={false} className={"w-[140px]"}>
                                <MenubarCheckboxItem
                                    textValue={"ASC"}
                                    className={"flex items-center gap-2"}
                                    checked={paginationState.order === "ASC"}
                                    onSelect={() => {
                                        handleChangePagination("order", "ASC")
                                    }}
                                >
                                    <ArrowDownNarrowWide size={18}/>Ascending
                                </MenubarCheckboxItem>
                                <MenubarCheckboxItem
                                    textValue={"DESC"}
                                    className={"flex items-center gap-2"}
                                    checked={paginationState.order === "DESC"}
                                    onSelect={() => {
                                        handleChangePagination("order", "DESC")
                                    }}
                                >
                                    <ArrowUpNarrowWide size={18}/>Descending
                                </MenubarCheckboxItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>

                    <Pagination className="mx-1 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    size={"sm"}
                                    onClick={() => {
                                        handleChangePagination("last")
                                    }}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    size={"sm"}
                                    onClick={() => {
                                        handleChangePagination("next")
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <Separator className="m-0"/>
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search"
                            className="pl-8"
                            onKeyDown={(event: any) => {
                                event.stopPropagation();
                                if (event.code === "Enter") {
                                    event.preventDefault();
                                    const value = event.target?.value as any;
                                    handleSearch(value);
                                }
                            }}
                        />
                    </div>
                </form>
            </div>
            {
                progress !== 100 && (
                    <div className="px-4 "><Progress value={progress}/></div>
                )
            }
            <ScrollArea
                className="px-4"
                style={{
                    height: `calc(100% - ${progress !== 100 ? 160 : 140}px)`,
                }}
                onScrollCapture={(event) => {
                    const {scrollTop, clientHeight, scrollHeight} = event.target as any;
                    if (scrollTop + clientHeight >= scrollHeight) {
                        console.log(1212)
                    }
                }}
            >
                <div className="flex flex-col gap-2 pt-0">
                    {
                        (mailList || []).map(item => (
                            <MailCard
                                key={item.id}
                                mail={item}
                            />
                        ))
                    }
                </div>
            </ScrollArea>

        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MailList;
