/**
 * Author: Moki
 * Date: 2022-09-09
 * FileName: 渲染进程入口文件
 **/
import ReactDOM from 'react-dom/client';
import ErrorBoundary from "@/src/render/components/ErrorBoundary";
import Routers from "@/src/render/routers";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ErrorBoundary>
        <Routers/>
    </ErrorBoundary>
);
