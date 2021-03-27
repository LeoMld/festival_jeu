import React, {useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormGroup, Input,
    InputGroup,
    InputGroupAddon, InputGroupText,
    Label, Modal,
    Row,
    Table
} from "reactstrap";
import useAxios from "../../utils/useAxios";
import token from "../../utils/token";
import Waiting from "../utils/Waiting";
import Axios from "axios";
import among_modify from "../../assets/images/amongus/among_modify.png";
import among_sage from "../../assets/images/amongus/among-sage.png";

function OrganisateursPane(){

    const {data:orgas,setData:setOrgas,isPending,error} = useAxios("/api/user/Organisateurs")
    const [isChangingOrgas,setIsChangingOrgas] = useState(false)
    const [errorOrgas,setErrorOrgas] = useState()
    const [errorOrgasAdd,setErrorOrgasAdd] = useState()
    const [isAddingOrga,setIsAddingOrga] = useState(false)
    const [stateModalOrgas,setStateModalOrgas] = useState(false)
    const [deleteModal,setDeleteModal] = useState(false)

    const REGEXMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    const [nomOrga,setNomOrga] = useState("")
    const [prenomOrga,setPrenomOrga] = useState("")
    const [mailOrga,setMailOrga] = useState("")
    const [pwdOrga,setPwdOrga] = useState("")

    const changeViewDelete = (id)=>{
        const newOrgas = orgas.filter(orga=>orga.idUtilisateur !== id)
        setOrgas(newOrgas)
    }

    const addOrganisateur = ()=>{

        if(nomOrga.length > 1 && prenomOrga.length > 1 && pwdOrga.length > 1){
            if(mailOrga.match(REGEXMAIL)){
                setIsAddingOrga(true)
                setErrorOrgasAdd()
                setIsChangingOrgas(true)
                Axios.post('/api/user/Organisateurs',{nomUtilisateur:nomOrga,prenomUtilisateur:prenomOrga,mailUtilisateur:mailOrga,mdpUtilisateur:pwdOrga} ,{ headers: { Authorization: token.getToken() } })
                    .then((result) => {
                        setErrorOrgas()
                        setOrgas(prev=>[...prev,...[{nomUtilisateur:nomOrga,prenomUtilisateur:prenomOrga,mailUtilisateur:mailOrga,idUtilisateur:result.data}]])
                        setStateModalOrgas(false)
                        setIsChangingOrgas(false)
                        setNomOrga("")
                        setPrenomOrga("")
                        setMailOrga("")
                        setPwdOrga("")
                        setIsAddingOrga(false)



                    }).catch(e => {
                    setErrorOrgasAdd("Erreur lors de l'ajout")
                    setIsChangingOrgas(false)

                    //if the token is not the good one
                    if(e.response.data.code === 0){
                        token.destroyToken()
                    }
                })
            }else{
                setErrorOrgasAdd("Veuillez rentrer un vrai mail")
            }
        }else{
            setErrorOrgasAdd("Veuillez remplir tous les champs")

        }

    }

    const removeOrganisateur = (id)=>{
        setIsChangingOrgas(true)
        Axios.delete('/api/user/Organisateurs/'+id, { headers: { Authorization: token.getToken() } })
            .then(() => {
                setErrorOrgas()
                changeViewDelete(id)
                setDeleteModal(false)

                setIsChangingOrgas(false)

            }).catch(e => {
                setErrorOrgas("Erreur lors de la suppression")
                setDeleteModal(false)

                setIsChangingOrgas(false)

            //if the token is not the good one
            if(e.response.data.code === 0){
                token.destroyToken()
            }
        })
    }

    return (
        <>
            {error && <Alert color="danger">Erreur lors du chargement des Organisateurs</Alert>}
            {(isPending || isChangingOrgas) && <Waiting name={"Chargement des organisateurs"}/>}
            {!isChangingOrgas && orgas && <div>
                <Row className="justify-content-end">
                    <Button onClick={()=>{setStateModalOrgas(!stateModalOrgas)}} color="success" outline>Ajouter un Organisateur</Button>
                    <Modal
                        className="modal-dialog-centered"
                        size="lg"
                        isOpen={stateModalOrgas}
                        toggle={() => setStateModalOrgas(!stateModalOrgas)}
                    >

                        <div className="modal-body p-0">
                            <Card className="bg-secondary shadow border-0">
                                <div className="mr-sm-3 mt-sm-3">
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() => setStateModalOrgas(!stateModalOrgas)}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <CardHeader className="bg-transparent pb-5">
                                    <div className="text-muted text-center mt-2 mb-3">
                                        <h3>Ajouter un organisateur</h3>
                                        <img
                                            style={{height : "100px"}}
                                            alt="logo"
                                            className="img-fluid floating"
                                            src={among_modify}
                                        />
                                    </div>


                                </CardHeader>

                                <CardBody  className="px-lg-5 py-lg-5">
                                    <Form role="form">

                                        <FormGroup className="mb-3">
                                            <Label for="nomOrga">Nom</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-circle-08" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={nomOrga} onChange={(event)=>{setNomOrga(event.target.value)}} id="nomOrga" placeholder="Nom" type="text" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <Label for="prenomOrga">Prénom</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-circle-08" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={prenomOrga} onChange={(event)=>{setPrenomOrga(event.target.value)}} id="prenomOrga" placeholder="Prénom" type="text" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <Label for="mailOrga">Mail</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={mailOrga} onChange={(event)=>{setMailOrga(event.target.value)}} id="mailOrga" placeholder="Mail" type="text" />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className="mb-3">
                                            <Label for="pwdOrga">Mot de passe</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-key-25" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={pwdOrga} onChange={(event)=>{setPwdOrga(event.target.value)}} id="pwdOrga" placeholder="Mot de passe" type="password" />
                                            </InputGroup>
                                        </FormGroup>

                                        <div className="text-center">
                                            {!isAddingOrga && <Button
                                                onClick={()=>{addOrganisateur()}}
                                                className="my-4"
                                                color="primary"
                                                type="button"
                                            >
                                                Ajouter
                                            </Button>}
                                            {isAddingOrga && <Waiting className="mt-md" name={"loading"} />}
                                            {errorOrgasAdd && <Alert color="danger">{errorOrgasAdd}</Alert> }
                                        </div>

                                    </Form>
                                </CardBody>
                            </Card>
                        </div>

                    </Modal>
                </Row>
                <h4 className="font-weight-600">Gestion des organisateurs</h4>
                <hr style={{width:"20%"}}/>
                {errorOrgas && <Alert color="danger" >{errorOrgas}</Alert>}
                <Table striped>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Mail</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orgas.map((orga,index) =>{
                        return(
                            <tr>
                                <th scope="row">{index}</th>
                                <td>{orga.nomUtilisateur}</td>
                                <td>{orga.prenomUtilisateur}</td>
                                <td>{orga.mailUtilisateur}</td>
                                <td><Button onClick={()=>{setDeleteModal(orga.idUtilisateur)}} color="danger">
                                    <i className="ni ni-fat-remove"/>
                                    Supprimer
                                </Button></td>
                            </tr>
                        )
                    })}
                    <Modal
                        className="modal-dialog-centered modal-danger"
                        contentClassName="bg-gradient-danger"
                        isOpen={deleteModal}
                        toggle={() => setDeleteModal(false)}
                    >
                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-notification">
                                Attention
                            </h6>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setDeleteModal(false)}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>

                        </div>

                        <div className="modal-body">
                            <div className="py-3 text-center">
                                <img
                                    style={{height : "80px"}}
                                    alt="logo"
                                    className="img-fluid floating"
                                    src={among_sage}
                                />
                                <h4 className="heading mt-4">Veuillez confirmer la suppression</h4>
                                <p>
                                    Vous allez supprimer cet organisateur
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">

                            <Button
                                className="text-white ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setDeleteModal(false)}
                            >
                                Annuler
                            </Button>
                            <div className="text-center">
                                <Button
                                    onClick={()=>{removeOrganisateur(deleteModal)}}
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                >
                                    Supprimer
                                </Button>
                            </div>

                            {errorOrgas && <Alert color="danger">
                                Erreur lors de la deletion, veuillez réessayer plus tard
                            </Alert> }
                        </div>
                    </Modal>

                    </tbody>
                </Table>
            </div>}
        </>
    )


}

export default OrganisateursPane
