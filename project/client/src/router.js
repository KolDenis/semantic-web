import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Cities from "./components/Cities";
import City from "./components/City";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Cities />
            },
            {
                path: "city/:id",
                element: <City />
            }
        ]
    }
]);

export default router;