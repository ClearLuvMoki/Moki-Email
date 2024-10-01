import Nav from "@render/mail-view/Sidebar/components/Nav";
import {Mail, MessageSquareDot} from "lucide-react";
import {Separator} from "@components/ui/separator";
import {useEffect, useMemo, useState} from "react";
import MailContent from "@render/setting-view/MailContent";
import {observer} from "mobx-react";
import Store from "../store"

const NavArr = [
    {
        title: "邮箱",
        value: "mail",
        icon: Mail,
        variant: "default"
    },
    {
        title: "通知",
        value: "toast",
        icon: MessageSquareDot,
        variant: "default"
    }
]

const App = observer(() => {
    const {reloadAccountList} = Store;
    const [menu, setMenu] = useState("mail")

    const $render = useMemo(() => {
        switch (menu) {
            case "mail": {
                return <MailContent/>
            }
            default: {
                return <MailContent/>
            }
        }
    }, [menu])

    useEffect(() => {
        reloadAccountList();
    }, [])

    return (
        <div className="w-full h-full flex">
            <div className={"w-36"}>
                <Nav
                    isCollapsed={false}
                    links={NavArr.map(item => {
                        return {
                            title: item.title,
                            icon: item.icon,
                            variant: item.value === menu ? "default" : "ghost"
                        }
                    })}
                    onClick={(index) => {
                        setMenu(NavArr[index].value)
                    }}
                />
            </div>
            <Separator orientation="vertical"/>
            <div className="flex-1 p-4">
                {$render}
            </div>
        </div>
    );
});

export default App;
