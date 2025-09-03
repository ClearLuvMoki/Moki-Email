import { SidebarProvider } from "../ui/sidebar";
import Content from "./content";
import { AppSidebar } from "./sidebar";

const Layout = () => {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "350px",
				} as React.CSSProperties
			}
		>
			<AppSidebar />
			<Content />
		</SidebarProvider>
	);
};

export default Layout;
