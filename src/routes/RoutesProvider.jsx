
import {
          Route,
          Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
import administration_routes from "./admin/administration_routes";
import role_routes from "./admin/role_routes";

export default function RoutesProvider () {
    return (
            <Routes>
                    <Route path="/" element={<RootPage />}></Route>
                    {administration_routes}
                    {role_routes}
            </Routes>
    )
}