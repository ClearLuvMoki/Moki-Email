import Sidebar from "@render/mail-view/Sidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@components/ui/resizable"
import {cn} from "@render/utils";
import MailList from "@render/mail-view/MailList";

import Store from "@render/mail-view/store";
import {observer} from "mobx-react"
import {useEffect} from "react";
import {
    RIPCGetAccountInfo,
    RIPCGetMailBoxes, RIPCGetNewMail,
    RIPCMailInitReady
} from "@render/ripc/mail";
import MailDetails from "@render/mail-view/MailDetails";
import {useInterval} from "ahooks";
import {MailBoxType} from "@src/types/mail";
import {toast} from "sonner";
import {IPCChannel} from "@src/types/ipc";

const LayoutSize = [265, 440, 655];


const App = observer(() => {
    const {isCollapsedSide, updateBoxList, updateActiveBox, updateIsCollapsedSide, updateMailAccountInfo} = Store;

    useEffect(() => {
        window.IPC.invoke(IPCChannel.GetViewId)
            .then((res) => {
                console.log(res, 'resss')
            })
        RIPCMailInitReady()
            .then(() => {
                RIPCGetAccountInfo()
                    .then((res) => {
                        if (res.account) {
                            updateMailAccountInfo(res)
                        }
                    })
                RIPCGetMailBoxes()
                    .then((res) => {
                        console.log(res, 'resss')
                        updateActiveBox(res.find(item => item.type === 'INBOX') as MailBoxType)
                        updateBoxList(res)

                    })
            })
    }, [])

    // useInterval(() => {
    //     RIPCGetNewMail()
    //         .then((res) => {
    //             if (res && res?.length > 0) {
    //                 for (let i = 0; i < res.length; i++) {
    //                     toast("您有新的邮件", {
    //                         description: res[i].subject,
    //                         duration: Infinity,
    //                     })
    //                 }
    //             }
    //         })
    // }, 3000);

    return (
        <div className="w-full h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full h-full max-h-[800px] items-stretch"
            >
                <ResizablePanel
                    defaultSize={LayoutSize[0]}
                    collapsedSize={4}
                    collapsible={true}
                    minSize={15}
                    maxSize={20}
                    onResize={(size) => {
                        if (size < 6) {
                            updateIsCollapsedSide(true)
                        } else {
                            updateIsCollapsedSide(false)
                        }
                    }}

                    className={cn(
                        isCollapsedSide &&
                        "min-w-[50px] transition-all duration-300 ease-in-out"
                    )}
                >
                    <Sidebar/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={LayoutSize[1]} minSize={40}>
                    <MailList/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={LayoutSize[2]} minSize={40}>
                    <MailDetails/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
});

export default App;
