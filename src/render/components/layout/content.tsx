import { useStore } from "@src/render/store";
import { useEffect, useRef } from "react";
import { SidebarInset } from "../ui/sidebar";
import ContentHeader from "./content-header";

const Content = () => {
	const { selectMail } = useStore();
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hostRef.current && selectMail?.html) {
			let shadow: ShadowRoot;
			if (hostRef.current.shadowRoot) {
				shadow = hostRef.current.shadowRoot;
			} else {
				shadow = hostRef.current.attachShadow({ mode: "open" });
			}
			shadow.innerHTML = selectMail?.html;
		}
	}, [selectMail?.html]);

	return (
		<SidebarInset>
			{selectMail?.id && (
				<div className="flex flex-1 flex-col">
					<ContentHeader />
					<div ref={hostRef} className="w-full h-full overflow-auto p-10 " />
				</div>
			)}
		</SidebarInset>
	);
};

export default Content;
