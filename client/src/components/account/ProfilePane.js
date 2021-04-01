import React, {useState} from "react";
import useAxios from "../../utils/useAxios";
import token from "../../utils/token";
import {
    Alert, Button,
    Card, CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup, Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText, Label, Modal,
    Row
} from "reactstrap";
import Waiting from "../utils/Waiting";
import among_modify from "../../assets/images/amongus/among_modify.png";

import Axios from "axios";

function ProfilePane(){

    const {data:profil,isPending,error} = useAxios("/api/user/profile/"+token.getId())
    const [modalState,setModalState] = useState(false)
    const [isChanging,setIsChanging] = useState(false)
    const [nom,setNom] = useState()
    const [prenom,setPrenom] = useState()
    const [mail,setMail] = useState()
    const [pwd,setPwd] = useState("")
    const [errorModify,setErrorModify] = useState()


    const handleChange = ()=>{
        setErrorModify()
        setIsChanging(true)
        Axios.put('/api/user/profile', {prenom,nom,pwd,mail},{ headers: { Authorization: token.getToken() } })
            .then(() => {
                profil.prenomUtilisateur =prenom
                profil.nomUtilisateur = nom
                profil.mailUtilisateur = mail
                setModalState(!modalState)
                setIsChanging(false)

            }).catch(e => {
                if(e.response.status === 401){
                    setErrorModify("Mauvais mot de passe")

                }else if(e.response.status === 400){
                    setErrorModify("Vous devez renseigner un mail valide")

                }else{
                    setErrorModify("Erreur lors de la modification")

                }
                setIsChanging(false)

                //if the token is not the good one
                if(e.response.data.code === 0){
                    token.destroyToken()
                }
        })

    }

    return(
         <>
             {error && <Alert color="danger"> Erreur lors du chargement de votre profil</Alert>}
             {isPending && <Waiting name={"Chargement des données"}/>}
             {profil && !isPending && <div>
                 <h4 className="font-weight-600">Mon profil</h4>
                 <hr style={{"width":"50%"}}/>
                 <Row className="mt-sm-4">
                     <Col md="6">
                         <Row>
                             <Col >
                                 <strong>Nom :</strong>
                             </Col>
                             <Col className="d-inline-flex" >
                                 {profil.nomUtilisateur}
                             </Col>
                         </Row>
                         <Row className="mt-sm-4 ">
                             <Col >
                                 <strong>Prénom :</strong>
                             </Col>
                             <Col className="d-inline-flex" >
                                 {profil.prenomUtilisateur}
                             </Col>
                         </Row>
                         <Row className="mt-sm-4 ">
                             <Col >
                                 <strong>Mail :</strong>
                             </Col>
                             <Col className="d-inline-flex" >
                                 {profil.mailUtilisateur}
                             </Col>
                         </Row>
                     </Col>
                     <Col md="6">
                         {token.getType() === 1 &&<div>
                             <i style={{"font-size": "6rem"}} className="ni ni-controller"/>
                             <p className="mt-sm-2">
                                 Vous êtes administrateur
                             </p>
                         </div>}
                         {token.getType() === 0 &&<div>
                             <i style={{"font-size": "6rem"}} className="ni ni-calendar-grid-58"/>
                             <p className="mt-sm-2">
                                 Vous êtes Organisateur
                             </p>
                         </div>}

                     </Col>
                 </Row>

                 <Row className=" mt-md justify-content-center">
                     <Button onClick={()=>{
                         setMail(profil.mailUtilisateur)
                         setPrenom(profil.prenomUtilisateur)
                         setNom(profil.nomUtilisateur)
                         setModalState(!modalState)}} color="primary" outline>Modifier ces informations</Button>
                     <Modal
                         className="modal-dialog-centered"
                         size="lg"
                         isOpen={modalState}
                         toggle={() => setModalState(!modalState)}
                     >

                         <div className="modal-body p-0">
                             <Card className="bg-secondary shadow border-0">
                                 <div className="mr-sm-3 mt-sm-3">
                                     <button
                                         aria-label="Close"
                                         className="close"
                                         data-dismiss="modal"
                                         type="button"
                                         onClick={() => setModalState(!modalState)}
                                     >
                                         <span aria-hidden={true}>×</span>
                                     </button>
                                 </div>
                                 <CardHeader className="bg-transparent pb-5">
                                     <div className="text-muted text-center mt-2 mb-3">
                                         <h3>Modifier son compte</h3>
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
                                             <Label for="nomForm">Nom</Label>
                                             <InputGroup className="input-group-alternative">
                                                 <InputGroupAddon addonType="prepend">
                                                     <InputGroupText>
                                                         <i className="ni ni-email-83" />
                                                     </InputGroupText>
                                                 </InputGroupAddon>
                                                 <Input type="text" value={nom} onChange={(event)=>{setNom(event.target.value)}} id="nomForm" placeholder="Nom" />
                                             </InputGroup>
                                         </FormGroup>

                                         <FormGroup className="mb-3">
                                             <Label for="prenomForm">Prénom</Label>
                                             <InputGroup className="input-group-alternative">
                                                 <InputGroupAddon addonType="prepend">
                                                     <InputGroupText>
                                                         <i className="ni ni-email-83" />
                                                     </InputGroupText>
                                                 </InputGroupAddon>
                                                 <Input type="text" value={prenom} onChange={(event)=>{setPrenom(event.target.value)}} id="prenomForm" placeholder="Prénom" />
                                             </InputGroup>
                                         </FormGroup>

                                         <FormGroup className="mb-3">
                                             <Label for="email">Mail</Label>
                                             <InputGroup className="input-group-alternative">
                                                 <InputGroupAddon addonType="prepend">
                                                     <InputGroupText>
                                                         <i className="ni ni-email-83" />
                                                     </InputGroupText>
                                                 </InputGroupAddon>
                                                 <Input type="email" value={mail} onChange={(event)=>{setMail(event.target.value)}} id="email" placeholder="Mail" />
                                             </InputGroup>
                                         </FormGroup>
                                            <hr/>
                                            <div className="text-red text-center">
                                                <p>Veuillez entrer votre mot de passe pour valider les modifications</p>

                                            </div>
                                         <FormGroup className="mb-3">
                                             <Label for="pwd">Mot de passe</Label>
                                             <InputGroup className="input-group-alternative">
                                                 <InputGroupAddon addonType="prepend">
                                                     <InputGroupText>
                                                         <i className="ni ni-key-25" />
                                                     </InputGroupText>
                                                 </InputGroupAddon>
                                                 <Input value={pwd} onChange={(event)=>{setPwd(event.target.value)}} id="pwd" placeholder="Mot de passe" type="password" />
                                             </InputGroup>
                                         </FormGroup>

                                         <div className="text-center">
                                             {!isChanging && <Button
                                                 onClick={()=>{handleChange()}}
                                                 className="my-4"
                                                 color="primary"
                                                 type="button"
                                             >
                                                 Modifier
                                             </Button>}
                                             {isChanging && <Waiting className="mt-md" name={"loading"} />}
                                             {errorModify && <Alert color="danger">{errorModify}</Alert> }
                                         </div>

                                     </Form>
                                 </CardBody>
                             </Card>
                         </div>

                     </Modal>
                 </Row>

             </div>}
        </>
    )
}

export default ProfilePane
