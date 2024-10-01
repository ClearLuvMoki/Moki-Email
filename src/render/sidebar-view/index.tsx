import "../base.css"
import ReactDOM from 'react-dom/client';
import App from "@render/sidebar-view/App";
import Store from "@render/setting-view/store";
import {Provider} from "mobx-react";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Provider store={Store}>
        <App/>
    </Provider>
);
