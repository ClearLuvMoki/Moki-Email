import { MailChannel } from '@src/domains'
import { MailType } from '@src/domains/types'
import { cn } from '@src/render/lib/utils'
import { useStore } from '@src/render/store'
import { useVirtualizer } from '@tanstack/react-virtual'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Label } from '../ui/label'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'
import { Switch } from '../ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function htmlToText(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.querySelectorAll('script,style,noscript,template,iframe').forEach(el => el.remove())
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export function buildPreview({ textPlain, html }: { textPlain?: string; html?: string }, maxLen = 160) {
    const raw = (textPlain && textPlain.trim()) || (html ? htmlToText(html) : '')
    return raw.slice(0, maxLen)
}

const MailList = () => {
    const {
        loading: allLoading,
        mails,
        selectMail,
        setSelectMail,
        selectMenu,
        setMails,
        reloadMail,
        paginationState,
        listLoading,
        searchState,
    } = useStore()
    const scrollRef = useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: mails.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 116,
        overscan: 5,
    })
    const loading = useMemo(() => allLoading || listLoading, [allLoading, listLoading])
    const [hasNext, setHasNext] = useState(true)
    const [keyword, setKeword] = useState('')

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].slice(-1)
        if (!lastItem) return

        if (lastItem.index >= mails.length - 1 && !listLoading && hasNext) {
            reloadMail({
                keyword,
                pageNo: paginationState.pageNo + 1,
            }).then(res => setHasNext(res?.hasNext))
        }
    }, [rowVirtualizer.getVirtualItems(), mails.length, paginationState, listLoading, keyword, hasNext])

    const onSearch = debounce((value: string) => {
        setMails([])
        setKeword(value)
        reloadMail({
            keyword: value,
            pageNo: 1,
        })
    }, 800)

    const onChangeRead = (unRead: boolean) => {
        setMails([])
        reloadMail({
            keyword,
            pageNo: 1,
            unRead,
        })
    }

    const onReadMail = (mail: MailType) => {
        setSelectMail(mail)
        console.log(mail, 'mail')
        if (mail?.isRead) {
            return
        }
        window.IPC.invoke(MailChannel.ReadMail, {
            id: mail?.id,
        }).then(() => {
            setMails(mails.map(item => (item.id === mail.id ? { ...item, isRead: true } : item)))
        })
    }

    return (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex !h-full">
            <SidebarHeader className="gap-3.5 border-b p-4 h-[100px]">
                <div className="flex w-full items-center justify-between">
                    <div className="text-foreground text-base font-medium">
                        {selectMenu?.name}
                        {selectMenu?.name && (
                            <span className="text-zinc-400 text-xs">({paginationState?.total || 0})</span>
                        )}
                    </div>
                    <Label className="flex items-center gap-2 text-sm">
                        <span>Unreads</span>
                        <Switch className="shadow-none" checked={searchState.unRead} onCheckedChange={onChangeRead} />
                    </Label>
                </div>
                <SidebarInput
                    placeholder="Search..."
                    onChange={e => {
                        onSearch(e?.target?.value)
                    }}
                />
            </SidebarHeader>
            <SidebarContent className="!h-[calc(100%-100px)]">
                <SidebarGroup className="px-0" ref={scrollRef} style={{ height: '100%', overflow: 'auto' }}>
                    <SidebarGroupContent
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {!loading && rowVirtualizer.getVirtualItems().length === 0 && (
                            <div className="p-4 text-zinc-400 select-none">None.</div>
                        )}

                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const mail = mails[virtualRow.index]
                            return (
                                <div
                                    key={virtualRow.index}
                                    className={cn(
                                        'relative hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 cursor-pointer',
                                        {
                                            'bg-sidebar-accent': mail?.id === selectMail?.id,
                                        }
                                    )}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        transform: `translateY(${virtualRow.start}px)`,
                                        height: 116,
                                    }}
                                    onClick={() => onReadMail(mail)}
                                >
                                    {!mail?.isRead && (
                                        <div className="absolute left-1 top-5.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    )}
                                    <div className="flex w-full items-center gap-2">
                                        <span>{mail?.sender?.[0]?.name}</span>{' '}
                                        <span className="ml-auto text-xs">
                                            {mail.date ? dayjs(mail?.date).format('YYYY-MM-DD') : ''}
                                        </span>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="font-medium max-w-50 truncate">{mail.subject}</div>
                                        </TooltipTrigger>
                                        <TooltipContent>{mail.subject}</TooltipContent>
                                    </Tooltip>
                                    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                                        {buildPreview({ html: mail.html }, 200)}
                                    </span>
                                </div>
                            )
                        })}
                        {loading && (
                            <div className="flex flex-col gap-2 p-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="w-20 h-4" />
                                    <Skeleton className="w-10 h-4" />
                                </div>
                                <Skeleton className="w-40 h-4 mb-2" />
                                <Skeleton className="w-70 h-4" />
                                <Skeleton className="w-70 h-4" />
                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default MailList
