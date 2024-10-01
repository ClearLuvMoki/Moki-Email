import {memo} from 'react';
import deepEqual from "deep-equal";
import {observer} from "mobx-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@components/ui/tooltip";
import {Button} from "@components/ui/button";
import {Archive, ArchiveX, Calendar, Clock, Forward, MoreVertical, Reply, ReplyAll, Trash2} from "lucide-react";
import {Separator} from "@components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@components/ui/popover";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@components/ui/dropdown-menu";
import Store from "@render/mail-view/store";
import {Avatar, AvatarFallback, AvatarImage} from "@components/ui/avatar";
import {Label} from "@components/ui/label";
import {Switch} from "@components/ui/switch";
import {Textarea} from "@components/ui/textarea";
import MailView from "@render/mail-view/MailDetails/components/MailView";

const MailDetails = memo(observer(() => {
    const {selectMail} = Store;


    return (
        <div className="flex h-full flex-col">
            <div
                className="flex items-center p-2 h-[44px]"
            >
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Archive className="h-4 w-4"/>
                                <span className="sr-only">Archive</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <ArchiveX className="h-4 w-4"/>
                                <span className="sr-only">Move to junk</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to junk</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Move to trash</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to trash</TooltipContent>
                    </Tooltip>
                    <Separator orientation="vertical" className="mx-1 h-6"/>
                    <Tooltip>
                        <Popover>
                            <PopoverTrigger asChild>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Clock className="h-4 w-4"/>
                                        <span className="sr-only">Snooze</span>
                                    </Button>
                                </TooltipTrigger>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-[535px] p-0">
                                <div className="flex flex-col gap-2 border-r px-2 py-4">
                                    <div className="px-4 text-sm font-medium">Snooze until</div>
                                    <div className="grid min-w-[250px] gap-1">
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Later today{" "}
                                            <span className="ml-auto text-muted-foreground">
                                            {/*{format(addHours(today, 4), "E, h:m b")}*/}
                                          </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Tomorrow
                                            <span className="ml-auto text-muted-foreground">
                                                {/*{format(addDays(today, 1), "E, h:m b")}*/}
                                              </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            This weekend
                                            <span className="ml-auto text-muted-foreground">
                                                {/*{format(nextSaturday(today), "E, h:m b")}*/}
                                              </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Next week
                                            <span className="ml-auto text-muted-foreground">
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <Calendar/>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <TooltipContent>Snooze</TooltipContent>
                    </Tooltip>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Reply className="h-4 w-4"/>
                                <span className="sr-only">Reply</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <ReplyAll className="h-4 w-4"/>
                                <span className="sr-only">Reply all</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply all</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Forward className="h-4 w-4"/>
                                <span className="sr-only">Forward</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward</TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 h-6"/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4"/>
                            <span className="sr-only">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Star thread</DropdownMenuItem>
                        <DropdownMenuItem>Add label</DropdownMenuItem>
                        <DropdownMenuItem>Mute thread</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator/>
            {selectMail?.uid ? (
                <div
                    className="flex flex-1 flex-col"
                    style={{
                        height: "calc(100% - 92px)"
                    }}
                >
                    <div
                        className="flex items-start p-4 h-[92px]"
                    >
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={selectMail.fromName}/>
                                <AvatarFallback>
                                    {selectMail.fromName
                                        .split(" ")
                                        .map((chunk) => chunk[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">{selectMail.fromName}</div>
                                <div className="line-clamp-1 text-xs">{selectMail.subject}</div>
                                <div className="line-clamp-1 text-xs">
                                    <span className="font-medium">Reply-To:</span> {selectMail.fromAddress}
                                </div>
                            </div>
                        </div>
                        {selectMail.date && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {selectMail.date}
                            </div>
                        )}
                    </div>
                    <Separator/>
                    <div
                        className="whitespace-pre-wrap p-4 text-sm overflow-y-scroll"
                        style={{height: "calc(100% - 230px)"}}
                    >
                        <MailView
                            content={selectMail.html || selectMail.text}
                        />
                    </div>
                    <Separator className="mt-auto"/>
                    <div className="p-4 h-[140px]">
                        <form>
                            <div className="grid gap-4">
                                <Textarea
                                    className="px-4 py-2"
                                    placeholder={`Reply ${selectMail.fromName}...`}
                                />
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="mute"
                                        className="flex items-center gap-2 text-xs font-normal"
                                    >
                                        <Switch id="mute" aria-label="Mute thread"/> Mute this
                                        thread
                                    </Label>
                                    <Button
                                        onClick={(e) => e.preventDefault()}
                                        size="sm"
                                        className="ml-auto"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No mail selected
                </div>
            )}

        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MailDetails;
