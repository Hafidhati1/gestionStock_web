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
    NOM_CLIENT: '',
    PRENOM_CLIENT: '',
    ADDRESSE_CLIENT: '',
    TEL_CLIENT: '',
    EMAIL_CLIENT: ''
   
}


export default function UpdateClient() {
    const dispacth = useDispatch()
    const [data, handleChange, setData, setValue] = useForm(initialForm)
    const [showCalendar, setShowCalendar] = useState(false);
 
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { idClient } = useParams()
    const [client, setClient] = useState(null)
    const [loadingClient, setLoadingClient] = useState(true)

    const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
        NOM_CLIENT: {
            required: true,
            alpha: true,
            length: [2, 50]
        },
        PRENOM_CLIENT: {
            required: true,
            alpha: true,
            length: [2, 50]
        },
        ADDRESSE_CLIENT: {
            required: true,
            alpha: true,
            length: [2, 50]
        }, TEL_CLIENT: {
            required: true,
            alpha: true,
            length: [2, 50]
        },
        EMAIL_CLIENT: {
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
            form.append("NOM_CLIENT", data.NOM_CLIENT)
            form.append("PRENOM_CLIENT", data.PRENOM_CLIENT)
            form.append("ADDRESSE_CLIENT", data.ADDRESSE_CLIENT)
            form.append("TEL_CLIENT", data.TEL_CLIENT)
            form.append("EMAIL_CLIENT", data.EMAIL_CLIENT)

            const res = await fetchApi(`/administration/client/${idClient}`, {
                method: 'PUT',
                body: form
            })
            dispacth(setToastAction({ severity: 'success', summary: 'Client modifiée', detail: "Le client a été modifiée avec succès", life: 3000 }))
            navigate('/client')
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
                            const res = await fetchApi(`/administration/client/${idClient}`)
                            
                            const uti = res
                            setClient(uti)
                            setData({
                                NOM_CLIENT: uti.client.NOM_CLIENT,
                                PRENOM_CLIENT: uti.client.PRENOM_CLIENT,
                                ADDRESSE_CLIENT: uti.client.ADDRESSE_CLIENT,
                                TEL_CLIENT: uti.client.TEL_CLIENT,
                                EMAIL_CLIENT: uti.client.EMAIL_CLIENT,
                                      
                            })
                  } catch (error) {
                            console.log(error)
                  } finally {
                            setLoadingClient(false)
                  }
        })()
}, [])

    const invalidClass = name => hasError(name) ? 'is-invalid' : ''
    if (loadingClient) {
        return <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <div className="spinner-border" role="status" />
        </div>
    }
    return (
        <>
            {isSubmitting ? <Loading /> : null}
            <div className="px-4 py-3 main_content bg-white has_footer">
                <div className="">
                    <h1 className="mb-3">Modification du client</h1>
                    <hr className="w-100" />
                </div>
                <form className="form w-75 mt-5" onSubmit={handleSubmit}>
                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="nom" className="label mb-1">Nom</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="NOM_CLIENT" name="NOM_CLIENT" value={data.NOM_CLIENT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('NOM_CLIENT') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('NOM_CLIENT') ? getError('NOM_CLIENT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="prenom" className="label mb-1">Prenom</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="PRENOM_CLIENT" name="PRENOM_CLIENT" value={data.PRENOM_CLIENT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PRENOM_CLIENT') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('PRENOM_CLIENT') ? getError('PRENOM_CLIENT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="adresse" className="label mb-1">Adresse complet</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="ADDRESSE_CLIENT" name="ADDRESSE_CLIENT" value={data.ADDRESSE_CLIENT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('ADDRESSE_CLIENT') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('ADDRESSE_CLIENT') ? getError('ADDRESSE_CLIENT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="telephone" className="label mb-1">Telephone</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="TEL_CLIENT" name="TEL_CLIENT" value={data.TEL_CLIENT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('TEL_CLIENT') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('TEL_CLIENT') ? getError('TEL_CLIENT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="email" className="label mb-1">E-mail</label>
                            </div>
                            <div className="col-sm">
                                <InputText type="text" id="EMAIL_CLIENT" name="EMAIL_CLIENT" value={data.EMAIL_CLIENT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL_CLIENT') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('EMAIL_CLIENT') ? getError('EMAIL_CLIENT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                   
                    <div style={{  bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end  pb-3 pr-5 bg-white">
                        <Button label="Annuler" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            navigate("/client")
                        }} />
                        <Button label="Modifier" type="submit" className="mt-3 ml-3" size="small" disabled={!isValidate() || isSubmitting} />
                    </div>
                </form>
            </div>
        </>
    )
}