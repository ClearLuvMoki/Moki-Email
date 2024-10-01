import {MailPlatform} from "@src/types/mail";
import {IconGmail, IconLank, IconQQ} from "@components/icon";

class Tools {

    static OS(): "window" | "mac" {
        const agent = navigator.userAgent.toLowerCase();
        const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
        if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
            return "window"
        }
        if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
            return "window"
        }
        if (isMac) {
            return "mac"
        }
        return "window"
    }

    static GetMailIconByType(type: MailPlatform, className?:string) {
        switch (type) {
            case MailPlatform.QQ:
                return <IconQQ className={className || ""}/>
            case MailPlatform.Gmail:
                return <IconGmail className={className || ""}/>
            case MailPlatform.Lank:
                return <IconLank className={className || ""}/>
        }
    }
}

export default Tools;
