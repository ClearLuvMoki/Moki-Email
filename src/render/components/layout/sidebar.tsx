import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@components/ui/sidebar'
import { MailChannel } from '@src/domains'
import { EmailBoxType } from '@src/domains/types'
import { useStore } from '@src/render/store'
import { Command, Settings } from 'lucide-react'
import type * as React from 'react'
import BoxIcon from '../ui/box-icon'
import { Skeleton } from '../ui/skeleton'
import MailList from './mail-list'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { menu, loading, selectMenu, setSelectMenu, setMails, reloadMail } = useStore()

    const onClickMenu = async (item: EmailBoxType) => {
        await window.IPC.invoke(MailChannel.OpenBox, {
            box: item.name,
        })
        setSelectMenu(item)
        setMails([])
        reloadMail({
            box: item.name,
            pageNo: 1,
        })
    }

    return (
        <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row h-full" {...props}>
            <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                {/** biome-ignore lint/a11y/useValidAnchor: <explanation> */}
                                <a href="#">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">Acme Inc</span>
                                        <span className="truncate text-xs">Enterprise</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            {loading ? (
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            ) : (
                                <SidebarMenu>
                                    {(menu || []).map(item => (
                                        <SidebarMenuItem key={item.key}>
                                            <SidebarMenuButton
                                                tooltip={{
                                                    children: item.name,
                                                    hidden: false,
                                                }}
                                                onClick={() => {
                                                    onClickMenu(item)
                                                }}
                                                isActive={selectMenu?.name === item.name}
                                                className="px-2.5 md:px-2 data-[active=true]:bg-zinc-200"
                                            >
                                                <BoxIcon type={item.specialUse} />
                                                <span>{item.name}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="flex fle-col items-center">
                    <SidebarMenuButton className="px-2.5 md:px-2">
                        <Settings className="" />
                    </SidebarMenuButton>
                </SidebarFooter>
            </Sidebar>

            <MailList />
        </Sidebar>
    )
}
