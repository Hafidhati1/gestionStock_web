import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
// import { administration_routes_items } from "../../routes/admin/administration_routes"
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from 'primereact/image';

const initialForm = {
    DESCR_CATEGORIE: '',
   
}


export default function UpdateCategorie() {
    const dispacth = useDispatch()
    const [data, handleChange, setData, setValue] = useForm(initialForm)
    const [showCalendar, setShowCalendar] = useState(false);
 
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { idCategorie } = useParams()
    const [categorie, setCategorie] = useState(null)
    const [loadingCategorie, setLoadingCategorie] = useState(true)

    const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
        DESCR_CATEGORIE: {
            required: true,
            alpha: true,
            length: [2, 50]
        }
    })
    const handleVisibility = (e) => {
        setShowCalendar(!showCalendar);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (!isValidate()) return false
            setIsSubmitting(true)
            const form = new FormData()
            form.append("DESCR_CATEGORIE", data.DESCR_CATEGORIE)

            const res = await fetchApi(`/administration/categorie/${idCategorie}`, {
                method: 'PUT',
                body: form
            })
            dispacth(setToastAction({ severity: 'success', summary: 'Categorie modifiée', detail: "La categorie a été modifiée avec succès", life: 3000 }))
            navigate('/categorie')
        } catch (error) {
            console.log(error)
            if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
                setErrors(error.result)
            } else {
                dispacth(setToastAction({ severity: 'error', summary: 'Erreur du système', detail: 'Erreur du système, réessayez plus tard', life: 3000 }));
            }
        } finally {
            setIsSubmitting(false)
        }
    }


    useEffect(() => {
        (async () => {
                  try {
                            const res = await fetchApi(`/administration/categorie/${idCategorie}`)
                             console.log(res)
                            const uti = res
                            setCategorie(uti)
                            setData({
                                DESCR_CATEGORIE: uti.categorie.DESCR_CATEGORIE,
                                      
                            })
                  } catch (error) {
                            console.log(error)
                  } finally {
                            setLoadingCategorie(false)
                  }
        })()
}, [])

    const invalidClass = name => hasError(name) ? 'is-invalid' : ''
    if (loadingCategorie) {
        return <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <div className="spinner-border" role="status" />
        </div>
    }
    return (
        <>
            {isSubmitting ? <Loading /> : null}
            <div className="px-4 py-3 main_content bg-white has_footer">
                {/* <div className="">
                    <h1 className="mb-3">{categorie.DESCR_CATEGORIE}</h1>
                    <hr className="w-100" />
                </div> */}
                <form className="form w-75 mt-5" onSubmit={handleSubmit}>
                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="nom" className="label mb-1">Categorie</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="DESCR_CATEGORIE" name="DESCR_CATEGORIE" value={data.DESCR_CATEGORIE} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('DESCR_CATEGORIE') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('DESCR_CATEGORIE') ? getError('DESCR_CATEGORIE') : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                   
                    <div style={{  bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end  pb-3 pr-5 bg-white">
                        <Button label="Annuler" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            navigate("/categorie")
                        }} />
                        <Button label="Modifier" type="submit" className="mt-3 ml-3" size="small" disabled={!isValidate() || isSubmitting} />
                    </div>
                </form>
            </div>
        </>
    )
}