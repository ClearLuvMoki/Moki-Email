import {memo} from 'react';
import deepEqual from "deep-equal";
import Store from "@render/mail-view/store";
import {cn} from "@render/utils";
import {MailType} from "@src/types/mail";
import {observer} from "mobx-react";

interface Props {
    mail: MailType
}

const MailCard = memo(observer(({mail}: Props) => {
    const {selectMail, updateSelectMail} = Store;
    return (
        <button
            className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                mail.id === selectMail?.id && "bg-muted"
            )}
            onClick={() =>
                updateSelectMail(mail)
            }
        >
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        {!mail.isRead && (
                            <span className="flex h-2 w-2 rounded-full bg-blue-600"/>
                        )}
                        <div className="font-semibold flex-1 max-w-56 break-words">{mail.subject}</div>
                    </div>
                    <div
                        className={cn(
                            "ml-auto text-xs",
                            mail.id === selectMail?.id
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {mail.date}
                    </div>
                </div>
            </div>
            <div className=" line-clamp-2 text-xs text-muted-foreground break-words break-all">
                {(mail.text || mail.html || "").substring(0, 300)}
            </div>
        </button>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default MailCard;
