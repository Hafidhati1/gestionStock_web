// import { createRoutesFromElements,Route,Routes} from "react-router-dom";

import { Route } from "react-router-dom";
import Categories from "../../pages/categorie/Categories";
import NewCategorie from "../../pages/categorie/NewCategorie";
import UpdateCategorie from "../../pages/categorie/UpdateCategorie";



const categorie_routes_items = {
    categories: {
        path: "categorie",
        name: "Categories",
        component: Categories
},
new_categories: {
    path: "categorie/new",
    name: "Nouvelle categorie",
    component: NewCategorie
},
edit_categorie: {
    path: "categorie/edit/:idCategorie",
    name: "Modifier la categories",
    component: UpdateCategorie
}
}

var categories_routes = []
for(let key in categorie_routes_items) {
          const route = categorie_routes_items[key]
          categories_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}
export default categories_routes
    