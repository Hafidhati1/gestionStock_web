
import { Route } from "react-router-dom";
import Client_List from "../../pages/client/Client_List"
import Client_Add from "../../pages/client/Client_Add"
import Client_Edit from "../../pages/client/Client_Edit"

export const client_routes_items = {
          clients: {
                    path: "clients",
                    name: "Clients",
                    element: <Client_List/>
          },
          new_client: {
                    path: "clients/new",
                    name: "Nouveau client",
                    element: <Client_Add/>
          },
          edit_client: {
                    path: "clients/edit/:idClient",
                    name: "Modifier le client",
                    element: <Client_Edit/>
          }
}
var client_routes = []
for(let key in client_routes_items) {
          const route = client_routes_items[key]
          client_routes.push(<Route path={route.path} element={route.element} key={route.path} />)
}
export default client_routes