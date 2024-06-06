import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { Button } from "primereact/button";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate } from "react-router-dom";
import { role_routes_items } from "../../routes/admin/role_routes";

const initialForm = {
  DESCRIPTION_ROLE: "",
};

export default function Role_New() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    hasError,
    getError,
    setErrors,
    checkFieldData,
    run,
    isValidate,
    setError,
  } = useFormErrorsHandle(data, {
    DESCRIPTION_ROLE: {
      required: true,
      alpha: true,
      length: [2, 50],
    },
  });
  //   const handleVisibility = (e) => {
  //             setShowCalendar(!showCalendar);
  //   };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isValidate()) return false;
      setIsSubmitting(true);
      const form = new FormData();
      form.append("DESCRIPTION_ROLE", data.DESCRIPTION_ROLE);
      const res = await fetchApi("/administration/role", {
        method: "POST",
        body: form,
      });
      dispacth(
        setToastAction({
          severity: "success",
          summary: "Role enregistré",
          detail: "Le role a été enregistré avec succès",
          life: 3000,
        })
      );
      navigate("/roles");
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
    dispacth(
      setBreadCrumbItemsAction([
        role_routes_items.roles,
        role_routes_items.new_roles,
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);

  //   useEffect(() => {
  //             fetchProvinces()
  //   }, [])

  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h2 className="mb-3">Nouveau role</h2>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="DESCRIPTION_ROLE" className="label mb-1">
                  Description
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Ecrire la description"
                  id="DESCRIPTION_ROLE"
                  name="DESCRIPTION_ROLE"
                  value={data.DESCRIPTION_ROLE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${
                    hasError("description") ? "p-invalid" : ""
                  }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("description") ? getError("description") : ""}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
            <Button
              label="Reinitialiser"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setData(initialForm);
                setErrors({});
              }}
            />
            <Button
              label="Envoyer"
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

// export default function Role_New(){
//     return(
//         <>
//         Nouveau role
//         </>
//     )
// }
