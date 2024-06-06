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
    NOM_PRODUIT: '',
    DESCR_PRODUIT: '',
    PRIX: '',
    QUANTITE: '',
    ID_CATEGORIE : ''
   
}


export default function UpdateProduits() {
    const dispacth = useDispatch()
    const [data, handleChange, setData, setValue] = useForm(initialForm)
    const [showCalendar, setShowCalendar] = useState(false);
 
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { idProduit } = useParams()
    const [produit, setProduit] = useState(null)
    const [categories, setCategories] = useState([])
    const [loadingProduit, setLoadingProduit] = useState(true)

    const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
        NOM_PRODUIT: {
            required: true,
            alpha: true,
            length: [2, 50]
        },DESCR_PRODUIT: {
            required: true,
            alpha: true,
            length: [2, 50]
        },PRIX: {
            required: true,
            alpha: true,
            length: [2, 50]
        },QUANTITE: {
            required: true,
            alpha: true,
            length: [2, 50]
        },ID_CATEGORIE: {
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
            form.append("NOM_PRODUIT", data.NOM_PRODUIT)
            form.append("DESCR_PRODUIT", data.DESCR_PRODUIT)
            form.append("PRIX", data.PRIX)
            form.append("QUANTITE", data.QUANTITE)
            form.append("ID_CATEGORIE", data.ID_CATEGORIE.code)

            const res = await fetchApi(`/administration/produit/${idProduit}`, {
                method: 'PUT',
                body: form
            })
            dispacth(setToastAction({ severity: 'success', summary: 'Produit modifiée', detail: "Le produit a été modifiée avec succès", life: 3000 }))
            navigate('/produit')
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
                            const res = await fetchApi(`/administration/produit/${idProduit}`)
                            
                            const uti = res
                            console.log(uti)
                            setProduit(uti)
                            setData({
                                NOM_PRODUIT: uti.produit.NOM_PRODUIT,
                                DESCR_PRODUIT: uti.produit.DESCR_PRODUIT,
                                PRIX: uti.produit.PRIX,
                                QUANTITE: uti.produit.QUANTITE,
                                ID_CATEGORIE: { name: uti.produit.categories.DESCR_CATEGORIE, code: uti.produit.categories.ID_CATEGORIE }
                                      
                            })
                  } catch (error) {
                            console.log(error)
                  } finally {
                            setLoadingProduit(false)
                  }
        })()
}, [])

const fetchCategories = useCallback(async () => {
    try {
        const res = await fetchApi("/administration/categorie")
       
        setCategories(res.data.map(cat => {
            return {
                name: cat.DESCR_CATEGORIE,
                code: cat.ID_CATEGORIE
            }
        }))
    } catch (error) {
        console.log(error)
    }
}, [])

const formatCurrency = (amount, locale = 'fr-FR', currency = 'EUR') => {
    return new Intl.NumberFormat(locale, {
    //   style: 'currency',
    //   currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

useEffect(() => {
    formatCurrency()
    fetchCategories()
}, [])

    const invalidClass = name => hasError(name) ? 'is-invalid' : ''
    if (loadingProduit) {
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
                                <label htmlFor="categorie" className="label mb-1">Nom produit</label>
                            </div>
                            <div className="col-sm">
                                <InputText autoFocus type="text" placeholder="Nom" id="NOM_PRODUIT" name="NOM_PRODUIT" value={data.NOM_PRODUIT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('nom') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('NOM_PRODUIT') ? getError('NOM_PRODUIT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="categorie" className="label mb-1">Description </label>
                            </div>
                            <div className="col-sm">
                                <InputText autoFocus type="text" placeholder="Description" id="DESCR_PRODUIT" name="DESCR_PRODUIT" value={data.DESCR_PRODUIT} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('nom') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('DESCR_PRODUIT') ? getError('DESCR_PRODUIT') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="categorie" className="label mb-1">Prix</label>
                            </div>
                            <div className="col-sm">
                                <InputText autoFocus type="text" placeholder="Prix" id="PRIX" name="PRIX" value={formatCurrency(data.PRIX)} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('nom') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('PRIX') ? getError('PRIX') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="categorie" className="label mb-1">Quantite</label>
                            </div>
                            <div className="col-sm">
                                <InputText autoFocus type="text" placeholder="Quantite" id="QUANTITE" name="QUANTITE" value={formatCurrency(data.QUANTITE)} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('nom') ? 'p-invalid' : ''}`} />
                                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                                    {hasError('QUANTITE') ? getError('QUANTITE') : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-5">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="Categorie" className="label mb-1">Categorie</label>
                            </div>
                            <div className="col-sm">
                                <Dropdown
                                    value={data.ID_CATEGORIE}
                                    options={categories}
                                    onChange={e => setValue("ID_CATEGORIE", e.value)}
                                    optionLabel="name"
                                    id="ID_CATEGORIE"
                                    filter
                                    filterBy="name"
                                    placeholder="Selectionner la categorie"
                                    emptyFilterMessage="Aucun élément trouvé"
                                    emptyMessage="Aucun élément trouvé"
                                    name="ID_CATEGORIE"
                                    onHide={() => {
                                        checkFieldData({ target: { name: "ID_CATEGORIE" } })
                                    }}
                                    className={`w-100 ${hasError('ID_CATEGORIE') ? 'p-invalid' : ''}`}
                                    showClear


                                />
 
                            </div>
                        </div>
                    </div>
                   
                    <div style={{  bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end  pb-3 pr-5 bg-white">
                        <Button label="Annuler" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            navigate("/produit")
                        }} />
                        <Button label="Modifier" type="submit" className="mt-3 ml-3" size="small" disabled={!isValidate() || isSubmitting} />
                    </div>
                </form>
            </div>
        </>
    )
}