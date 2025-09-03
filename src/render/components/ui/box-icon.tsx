import { EmailBoxEnum } from "@src/domains/enum";
import { ArchiveX, Box, File, Inbox, Send, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";
import isEqual from "react-fast-compare";

const BoxIcon = memo(
	({
		type,
		className,
		style,
	}: {
		type: EmailBoxEnum;
		className?: string;
		style?: React.CSSProperties;
	}) => {
		const render = useMemo(() => {
			switch (type) {
				case EmailBoxEnum.Inbox:
					return <Inbox className={className} style={style} />;
				case EmailBoxEnum.Drafts:
					return <File className={className} style={style} />;
				case EmailBoxEnum.Sent:
					return <Send className={className} style={style} />;
				case EmailBoxEnum.Junk:
					return <ArchiveX className={className} style={style} />;
				case EmailBoxEnum.Trash:
					return <Trash2 className={className} style={style} />;
				default:
					return <Box className={className} style={style} />;
			}
		}, [type, className, style]);

		return render;
	},
	(prevProps, nextProps) => {
		return isEqual(prevProps, nextProps);
	},
);

export default BoxIcon;
