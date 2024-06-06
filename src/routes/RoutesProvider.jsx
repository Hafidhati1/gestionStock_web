
import {
          Route,
          Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
import administration_routes from "./admin/administration_routes";
import categories_routes from "./categorie/CategoriesRoute";
import produit_routes from "./produit/Produit_Route";

export default function RoutesProvider () {
          return (
                    <Routes>
                              <Route path="/" element={<RootPage />}></Route>
                              {administration_routes}
                              {categories_routes}
                              {produit_routes}
                    </Routes>
          )
}