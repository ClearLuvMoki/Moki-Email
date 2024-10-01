import "../base.css"
import ReactDOM from 'react-dom/client';
import App from "@render/setting-view/App";
import Store from "./store";
import {Provider} from "mobx-react";
import {Toaster} from "@components/ui/sonner";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Provider store={Store}>
        <Toaster position="top-right" closeButton={true} visibleToasts={10}/>
        <App/>
    </Provider>
);
