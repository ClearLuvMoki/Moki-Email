import "./styles/globals.css";
import ReactDOM from "react-dom/client";
import Layout from "./components/layout";

const rootEl = document.getElementById("root");
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(<Layout />);
}
