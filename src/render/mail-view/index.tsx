import "../base.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {TooltipProvider} from "@components/ui/tooltip";
import {Toaster} from "@components/ui/sonner"
import Store from "@render/mail-view/store";
import {Provider} from "mobx-react";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.Fragment>
        <Provider store={Store}>
            <Toaster position="top-right" closeButton={true} visibleToasts={10}/>
            <TooltipProvider delayDuration={0}>
                <App/>
            </TooltipProvider>
        </Provider>
    </React.Fragment>
);
