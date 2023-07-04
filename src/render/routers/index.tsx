import React, {Suspense} from 'react';
import {Route, RouteProps, Routes} from "react-router-dom";
import Layout from "@/src/render/layout";

const Home = React.lazy(() => import("@/pages/Home"))

const SideRouters: RouteProps[] = [
    {
        path: "/",
        index: true,
        element: <Home/>
    }
]

const Routers = () => {
    return (
        <Routes>
            <Route
                path={"/"}
                element={<Layout/>}
            >
                {
                    SideRouters.map(item => (
                        <Route
                            key={item.path}
                            path={item?.index ? null : item?.path}
                            element={<Suspense>
                                {item.element}
                            </Suspense>}
                        />
                    ))
                }
            </Route>
        </Routes>
    );
};

export default Routers;
