import { useStore } from "@src/render/store";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const RenderItem = ({
	label,
	name,
	email,
}: {
	label: string;
	name: string;
	email: string;
}) => {
	return (
		<div className="flex">
			<span className="text-xs text-zinc-400 mr-2">{label}&nbsp;</span>
			<span className="text-xs">{name}</span>
			<span className="text-xs text-zinc-300">{"<" + email + ">"}</span>
		</div>
	);
};

const ContentHeader = () => {
	const { selectMail } = useStore();
	return (
		<div className="flex p-4 justify-between">
			<div className="flex items-start gap-4">
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>{selectMail?.sender?.[0]?.name?.[0]}</AvatarFallback>
				</Avatar>
				<div>
					<div className="text-sm mb-2">{selectMail?.sender?.[0]?.name}</div>
					<RenderItem
						label="Sender"
						name={selectMail?.sender?.[0]?.name!}
						email={selectMail?.sender?.[0]?.email!}
					/>
					<RenderItem
						label="To"
						name={""}
						email={selectMail?.to?.[0]?.email!}
					/>
				</div>
			</div>
			<div>
				{selectMail?.date && (
					<div className="text-xs font-medium text-zinc-500 ">
						{dayjs(selectMail?.date).format("YYYY-MM-DD HH:mm:ss")}
					</div>
				)}
			</div>
		</div>
	);
};

export default ContentHeader;
