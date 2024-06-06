import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { Button } from "primereact/button";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Loading from "../../components/app/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { role_routes_items } from "../../routes/admin/role_routes";

const initialForm = {
  DESCRIPTION_ROLE: "",
};

export default function Role_Edit() {
    
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { idRole } = useParams();
  const [role, setRoles] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const {
    hasError,
    getError,
    setErrors,
    checkFieldData,
    isValidate,
    setError,
  } = useFormErrorsHandle(data, {
    DESCRIPTION_ROLE: {
      required: true,
      alpha: true,
      length: [2, 50],
    },
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isValidate()) return false;
      setIsSubmitting(true);
      const form = new FormData();
      form.append("DESCRIPTION_ROLE", data.DESCRIPTION_ROLE);
     
      const res = await fetchApi(`/administration/role/${idRole}`, {
        method: "PUT",
        body: form,
      });
      dispacth(
        setToastAction({
          severity: "success",
          summary: "Role enregistré",
          detail: "Le role a été modifié avec succès",
          life: 3000,
        })
      );
      navigate('/roles');
    } catch (error) {
      console.log(error);
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result);
      } else {
        dispacth(
          setToastAction({
            severity: "error",
            summary: "Erreur du système",
            detail: "Erreur du système, réessayez plus tard",
            life: 3000,
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi(`/administration/role/${idRole}`);
        const rol = res.result;
        setRoles(rol);
        setData({
          DESCRIPTION_ROLE: rol.DESCRIPTION_ROLE,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingRole(false);
      }
    })();
  }, []);

  useEffect(() => {
    dispacth(
      setBreadCrumbItemsAction([
        role_routes_items.roles,
        role_routes_items.edit_roles,
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);

  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  if (loadingRole) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 w-100">
        <div className="spinner-border" role="status" />
      </div>
    );
  }
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        {/* <div className="">
          <h1 className="mb-3">{role.DESCRIPTION_ROLE} </h1>
          <hr className="w-100" />
        </div> */}
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="DESCRIPTION_ROLE" className="label mb-1">
                  Description
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire la description"
                  id="DESCRIPTION_ROLE"
                  name="DESCRIPTION_ROLE"
                  value={data.DESCRIPTION_ROLE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${
                    hasError("DESCRIPTION_ROLE") ? "p-invalid" : ""
                  }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("DESCRIPTION_ROLE") ? getError("DESCRIPTION_ROLE") : ""}
                </div>
              </div>
            </div>
          </div>

          <div
            // style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end pb-3 pr-5 bg-white"
          >
            <Button
              label="Annuler"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                navigate("/roles");
              }}
            />
            <Button
              label="Modifier"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              disabled={!isValidate() || isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
}
// export default function Role_Edit(){
//     return(
//         <>
//         Modifier un role
//         </>
//     )
// }
