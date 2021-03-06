import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal
} from "reactstrap";
import React, {useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import token from "../../utils/token";

import among_modify from "../../assets/images/amongus/among_modify.png"
import useAxios from "../../utils/useAxios";

function ModalType(props){

    const [isChanging, setIsChanging] = useState(false)
    const [isChangingDelete, setIsChangingDelete] = useState(false)
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState("Erreur lors du changement des données, veuillez recharger la page et réessayer")

    const {data: types, setData: setTypes, isPending : isPendingTypes, error : errorTypes} = useAxios("/api/games/TypesJeux")

    const handleChangeDelete = ()=>{
        /*setMessageError("Erreur lors du changement des données, veuillez recharger la page et réessayer")*/
        const idType = document.getElementById("typeJeu").value
        setIsChangingDelete(true)
        Axios.delete('/api/games/TypesJeux/'+idType,{ headers: { Authorization: token.getToken() } })
            .then(res => {
                props.setModalState(!props.modalState)
                setIsChangingDelete(false)

            }).catch(e => {
                if(e.response.status === 400){
                    setMessageError("Ce type est encore lié à plusieurs jeux, suppression impossible ")
                }

            setIsChangingDelete(false)
            setError(true)
            //if the token is not the good one
            if(e.response.data.code === 0){
                token.destroyToken()
            }
        })

    }
    const handleChange = ()=>{
        setIsChanging(true)
        setError(false)
        const newType = document.getElementById("type").value

        Axios.post('/api/games/TypesJeux', {newType},{ headers: { Authorization: token.getToken() } })
            .then(res => {
                props.setModalState(!props.modalState)
                setIsChanging(false)

            }).catch(e => {
                if(e.response.status === 400){
                    setMessageError("Veuillez insérer un nom au type")
                    setIsChanging(false)
                    setError(true)
                }else{
                    setIsChanging(false)
                    setError(true)
                    //if the token is not the good one
                    if(e.response.data.code === 0){
                        token.destroyToken()
                    }
                }

        })

    }


    return(

        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={props.modalState}
            toggle={() => props.setModalState(!props.modalState)}
        >
            {(isPendingTypes ) && <Waiting className="mt-md" name={"Loading data"} />}

            {!isPendingTypes && <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                    <div className="mr-sm-3 mt-sm-3">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => props.setModalState(!props.modalState)}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <h3>Gestion des types</h3>
                            <img
                                style={{height : "100px"}}
                                alt="logo"
                                className="img-fluid floating"
                                src={among_modify}
                            />
                        </div>
                        {error && <Alert color="danger">
                            {messageError}
                        </Alert> }

                    </CardHeader>
                    <CardHeader  className="px-lg-5 py-lg-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <h4>Supprimer un type</h4>
                        </div>
                        <div className="text-muted text-center mt-2 ">
                            <Form role="form">
                                {types && <FormGroup className="mb-3">

                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02" />
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        <Input  id="typeJeu" type="select"  name="select" >
                                            {types.data.map((type,index)=>{
                                                return(
                                                    <option key={index}  value={type.idTypeJeu}>{type.libelleTypeJeu}</option>
                                                )

                                            })}


                                        </Input>
                                    </InputGroup>
                                </FormGroup>}
                                <div className="text-center">
                                    {!isChangingDelete && <Button
                                        onClick={()=>{handleChangeDelete()}}
                                        className="my-4"
                                        color="danger"
                                        type="button"
                                    >
                                        Supprimer ce type
                                    </Button>}
                                    {isChangingDelete && <Waiting className="mt-md" name={"loading"} />}
                                </div>
                            </Form>
                        </div>
                    </CardHeader>
                    <CardBody  className="px-lg-5 py-lg-5">
                        <Form role="form">
                            <div className="text-muted text-center mb-3">
                                <h4>Ajouter un type</h4>
                            </div>
                            <FormGroup className="mb-3">
                                <Label for="type">Type du jeu</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-app" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="type" placeholder="Type du jeu" type="text" />
                                </InputGroup>
                            </FormGroup>

                            <div className="text-center">
                                {!isChanging && <Button
                                    onClick={()=>{handleChange()}}
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                >
                                    Ajouter ce type
                                </Button>}
                                {isChanging && <Waiting className="mt-md" name={"loading"} />}
                            </div>

                        </Form>
                    </CardBody>
                </Card>
            </div>}

        </Modal>




    )
}

export default ModalType
