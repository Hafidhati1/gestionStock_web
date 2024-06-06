

import { Route } from "react-router-dom";
import Role_List from "../../pages/role/Role_List";
import Role_New from "../../pages/role/Role_New";
import Role_Edit from "../../pages/role/Role_Edit"

export const role_routes_items = {
          roles: {
                    path: "roles",
                    name: "Roles",
                    element: <Role_List/>
          },
          new_roles: {
                    path: "roles/new",
                    name: "Nouveau role",
                    element: <Role_New/>
          },
          edit_roles: {
                    path: "role/edit/:idRole",
                    name: "Modifier le role",
                    element: <Role_Edit/>
          }
}
var role_routes = []
for(let key in role_routes_items) {
          const route = role_routes_items[key]
          role_routes.push(<Route path={route.path} element={route.element} key={route.path} />)
}
export default role_routes