import Tools from "@render/utils/tools";
import {cn} from "@render/utils";
import {Search, Settings} from "lucide-react";
import {Input} from "@components/ui/input";
import {RIPCShowSetting} from "@render/ripc/setting";
import {observer} from "mobx-react";

const App = observer(() => {
    const isMac = Tools.OS();

    const handleShowSetting = () => {
        RIPCShowSetting();
    }

    return (
        <div
            className={cn(
                "w-full h-full px-2 flex justify-end items-center border-b-[1px]",
                isMac && "pl-[90px]",
            )}
            style={{
                // @ts-ignore
                WebkitAppRegion: "drag"
            }}
        >
            <div
                className={"right-actions flex items-center gap-2"}
                style={{
                    // @ts-ignore
                    WebkitAppRegion: "no-drag"
                }}
            >
                <form>
                    <div className="relative ">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Global Search"
                            className="pl-8 w-[300px]"
                        />
                    </div>
                </form>
                <div
                    className="hover:bg-muted h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={handleShowSetting}
                >
                    <Settings size={20}/>
                </div>
            </div>

        </div>
    );
});

export default App;
