import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import fetchApi from "../../helpers/fetchApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SlideMenu } from "primereact/slidemenu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Loading from "../../components/app/Loading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { role_routes_items } from "../../routes/admin/role_routes";
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions";

export default function Role_List() {
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [totalRecords, setTotalRecords] = useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [roles, setRoles] = useState([]);
  const PaginatorLeft = <Button type="button" icon="pi pi-refresh" text/>
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const [selectedItems, setSelectedItems] = useState(null);
  const menu = useRef(null);
  const [globalLoading, setGloabalLoading] = useState(false);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);

  const navigate = useNavigate();

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    search: "",
  });

  const dispacth = useDispatch();
  const onPage = (event) => {
    setlazyState(event);
  };

  const onSort = (event) => {
    setlazyState(event);
  };
  const onSelectionChange = (event) => {
    const value = event.value;
    setSelectedItems(value);
    setSelectAll(value.length === totalRecords);
  };

  const deleteItems = async (itemsIds) => {
    try {
      setGloabalLoading(true);
      const form = new FormData();
    //   form.append("ids", JSON.stringify(itemsIds));
      const res = await fetchApi(`/administration/role/${itemsIds}`, {
        method: "delete",
        // body: form,
      });
      dispacth(
        setToastAction({
          severity: "success",
          summary: "Role supprimé",
          detail: "Le role a été supprimé avec succès",
          life: 3000,
        })
      );
      fetchRoles();
      setSelectAll(false);
      setSelectedItems(null);
    } catch (error) {
      console.log(error);
      dispacth(
        setToastAction({
          severity: "error",
          summary: "Erreur du système",
          detail: "Erreur du système, réessayez plus tard",
          life: 3000,
        })
      );
    } finally {
      setGloabalLoading(false);
    }
  };

  const handleDeletePress = (e, itemsids) => {
    e.preventDefault()
    e.stopPropagation()
    confirmDialog({
              header: 'Supprimer ?',
              message: <div className="d-flex flex-column align-items-center">
                        {inViewMenuItem ? <>
                        <div className="font-bold text-center my-2">{inViewMenuItem?.DESCRIPTION_ROLE} </div>
                        <div className="text-center">Voulez-vous vraiment supprimer ?</div>
                        </> : 
                        <>
                        <div className="text-muted">
                            { selectedItems ? selectedItems.length : '0' } selectionné{selectedItems?.length > 1 && 's'}
                        </div>
                        <div className="text-center">Voulez-vous vraiment supprimer les éléments selectionnés ?</div>
                        </>}
              </div>,
              acceptClassName: 'p-button-danger',
              accept: () => {
                        deleteItems(itemsids)
              }
    });
}

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const baseurl = `/administration/role?`;
      var url = baseurl;
      for (let key in lazyState) {
        const value = lazyState[key];
        if (value) {
          if (typeof value == "object") {
            url += `${key}=${JSON.stringify(value)}&`;
          } else {
            url += `${key}=${value}&`;
          }
        }
      }
      const res = await fetchApi(url);
      setRoles(res.data);
      setTotalRecords(res.totalRecords);
    } 
    catch (error) {
      console.log(error);
    } 
    finally {
      setLoading(false);
    }
  }, [lazyState]);

  useEffect(() => {
      dispacth(setBreadCrumbItemsAction([
          role_routes_items.roles
      ]))
      return () => {
                dispacth(setBreadCrumbItemsAction([]))
      }
  }, [])

  useEffect(() => {
    fetchRoles();
  }, [lazyState]);

  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />
      {globalLoading && <Loading />}
      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="mb-3">Liste des roles</h2>
          <Button
            label="Nouveau role"
            icon="pi pi-plus"
            size="small" 
            onClick={() => {
              navigate("/roles/new");
            }}
          />
        </div>
        <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
          <div className="d-flex  align-items-center">
            <div className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="Recherche"
                className="p-inputtext-sm"
                style={{ minWidth: 300 }}
                onInput={(e) =>
                  setlazyState((s) => ({ ...s, search: e.target.value }))
                }
              />
            </div>
            <div className="d-flex align-items-center">
              {/* <Dropdown */}
              {/* // value={selectedCity}
                            // onChange={(e) => setSelectedCity(e.value)}
                            // options={cities}
                            // optionLabel="name"
                            // placeholder="Province"
                            // className="w-full md:w-14rem mx-3 no-p"
                            // showClear */}
              {/* style={{ borderWidth: 0 }} */}
              {/* /> */}
            </div>
          </div>
          <div className="selection-actions d-flex align-items-center">
            <div className="text-muted mx-3">
              {selectedItems ? selectedItems.length : "0"} selectionné
              {selectedItems?.length > 1 && "s"}
            </div>
            <a
              href="#"
              className={`p-menuitem-link link-dark text-decoration-none ${
                (!selectedItems || selectedItems?.length == 0) &&
                "opacity-50 pointer-events-none"
              }`}
              style={{}}
              onClick={(e) =>
                handleDeletePress(
                  e,
                  selectedItems.map((item) => item.idRole)
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                style={{ marginRight: "0.3rem" }}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span className="p-menuitem-text">Supprimer</span>
            </a>
          </div>
        </div>
        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={roles}
              tableStyle={{ minWidth: "50rem" }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorLeft={PaginatorLeft}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun role trouvé"
              
              first={lazyState.first}
              rows={lazyState.rows}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              loading={loading}
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              selectAll={selectAll}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
              // size="normal"
            >
              <Column
                selectionMode="multiple"
                frozen
                headerStyle={{ width: "3rem" }}
              />

              <Column
                field="DESCRIPTION_ROLE"
                frozen
                header="DESCRIPTION_ROLE"
                sortable
                body={(item) => {
                  return <span>{item.DESCRIPTION_ROLE} </span>;
                }}
              />

              <Column
                field="options"
                header="OPTIONS"
                alignFrozen="right"
                frozen
                body={(item) => {
                  const items = [
                    {
                      label: "Plus de details",
                      icon: (options) => {
                        return (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-list"
                            viewBox="0 0 16 16"
                            {...options.iconProps}
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                            />
                          </svg>
                        );
                      },
                    },
                    {
                      template: () => {
                        return (
                          <Link
                            to={`/role/edit/${inViewMenuItem?.ID_ROLE}`}
                            className="p-menuitem-link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                              style={{ marginRight: "0.5rem" }}
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                            <span className="p-menuitem-text">Modifier</span>
                          </Link>
                        );
                      },
                    },
                    {
                      template: () => {
                        return (
                          <a
                            href="#"
                            className="p-menuitem-link text-danger"
                            onClick={(e) =>
                              handleDeletePress(e, [inViewMenuItem.ID_ROLE])
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash"
                              viewBox="0 0 16 16"
                              style={{ marginRight: "0.5rem" }}
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                            </svg>
                            <span className="p-menuitem-text text-danger">
                              Supprimer
                            </span>
                          </a>
                        );
                      },
                    },
                  ];
                  return (
                    <>
                      <SlideMenu
                        ref={menu}
                        model={items}
                        popup
                        viewportHeight={150}
                        menuWidth={220}
                        onHide={() => {
                          setInViewMenuItem(null);
                        }}
                      />
                      <Button
                        rounded
                        severity="secondary"
                        text
                        aria-label="Menu"
                        size="small"
                        className="mx-1"
                        onClick={(event) => {
                          setInViewMenuItem(item);
                          menu.current.toggle(event);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-three-dots"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                      </Button>
                    </>
                  );
                }}
              />
            </DataTable>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
