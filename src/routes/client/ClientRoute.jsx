// import { createRoutesFromElements,Route,Routes} from "react-router-dom";

import { Route } from "react-router-dom";
import ClientList from "../../pages/client/ClientList";
import NewClient from "../../pages/client/NewClient";
import UpdateClient from "../../pages/client/UpdateClient";



const client_routes_items = {
    categories: {
        path: "client",
        name: "Clients",
        component: ClientList
},
new_client: {
    path: "client/new",
    name: "Nouvel client",
    component: NewClient
},
edit_client: {
    path: "client/edit/:idClient",
    name: "Modifier le client",
    component: UpdateClient
}
 }

var client_routes = []
for(let key in client_routes_items) {
          const route = client_routes_items[key]
          client_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}
export default client_routes
    