import { cn } from "@render/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("bg-zinc-200/40 animate-pulse rounded-md", className)}
			{...props}
		/>
	);
}

export { Skeleton };
