// import { createRoutesFromElements,Route,Routes} from "react-router-dom";

import { Route } from "react-router-dom";
import Produits from "../../pages/produit/Produits";
import NewProduits from "../../pages/produit/NewProduits";
import UpdateProduits from "../../pages/produit/UpdateProduits";




const produit_routes_items = {
    produits: {
        path: "produit",
        name: "Produits",
        component: Produits
}
,
new_produits: {
    path: "produit/new",
    name: "Nouveaux produit",
    component: NewProduits
},
editProduit: {
    path: "produit/edit/:idProduit",
    name: "Modifier le produit",
    component: UpdateProduits
}
}

var produit_routes = []
for(let key in produit_routes_items) {
          const route = produit_routes_items[key]
          produit_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}
export default produit_routes
    