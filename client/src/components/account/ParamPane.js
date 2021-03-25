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
    InputGroupAddon,
    InputGroupText,
    Label, Modal,
    Row
} from "reactstrap";
import among_modify from "../../assets/images/amongus/among_modify.png";
import Waiting from "../utils/Waiting";
import Axios from "axios";
import token from "../../utils/token";

function ParamPane(){
    const [modalStatePwd,setModalStatePwd] = useState(false)
    const [isChangingPwd,setIsChangingPwd] = useState(false)
    const [errorModifyPwd,setErrorModifyPwd] = useState(false)
    const [newPwd,setNewPwd] = useState("")
    const [newPwdConfirm,setNewPwdConfirm] = useState("")
    const [OldPwd,setOldPwd] = useState("")

    const handleChange = ()=>{
        setErrorModifyPwd()
        if(newPwdConfirm !== newPwd){
            setErrorModifyPwd("Les mots de passe ne correspondent pas")
        }else{
            setIsChangingPwd(true)
            Axios.put('/api/user/profile/pwd', {OldPwd,newPwd},{ headers: { Authorization: token.getToken() } })
                .then(() => {
                    setModalStatePwd(!modalStatePwd)
                    setIsChangingPwd(false)
                }).catch(e => {
                if(e.response.status === 401){
                    setErrorModifyPwd("Mauvais mot de passe")

                }
                setIsChangingPwd(false)

                //if the token is not the good one
                if(e.response.data.code === 0){
                    token.destroyToken()
                }
            })
        }


    }

    return(
        <>
            <div>
                <h4 className="font-weight-600">Paramètres</h4>
                <hr style={{"width":"50%"}}/>
                <Row className="justify-content-center">
                    <Button onClick={()=>{setModalStatePwd(!modalStatePwd)}} outline color="primary">Modifier mon mot de passe</Button>
                    <Modal
                        className="modal-dialog-centered"
                        size="lg"
                        isOpen={modalStatePwd}
                        toggle={() => setModalStatePwd(!modalStatePwd)}
                    >

                        <div className="modal-body p-0">
                            <Card className="bg-secondary shadow border-0">
                                <div className="mr-sm-3 mt-sm-3">
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() => setModalStatePwd(!modalStatePwd)}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                </div>
                                <CardHeader className="bg-transparent pb-5">
                                    <div className="text-muted text-center mt-2 mb-3">
                                        <h3>Modifier son mot de passe</h3>
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
                                            <Label for="newPwd">Nouveau mot de passe</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-key-25" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={newPwd} onChange={(event)=>{setNewPwd(event.target.value)}} id="newPwd" placeholder="Nouveau mot de passe" type="password" />
                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <Label for="newPwdConfirm">confirmation du nouveau mot de passe</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-key-25" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={newPwdConfirm} onChange={(event)=>{setNewPwdConfirm(event.target.value)}} id="newPwdConfirm" placeholder="Confirmation du nouveau mot de passe" type="password" />
                                            </InputGroup>
                                        </FormGroup>



                                        <hr/>
                                        <div className="text-red text-center">
                                            <p>Veuillez entrer votre ancien mot de passe pour valider les modifications</p>

                                        </div>
                                        <FormGroup className="mb-3">
                                            <Label for="pwd">Mot de passe</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-key-25" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input value={OldPwd} onChange={(event)=>{setOldPwd(event.target.value)}} id="pwd" placeholder="Mot de passe" type="password" />
                                            </InputGroup>
                                        </FormGroup>

                                        <div className="text-center">
                                            {!isChangingPwd && <Button
                                                onClick={()=>{handleChange()}}
                                                className="my-4"
                                                color="primary"
                                                type="button"
                                            >
                                                Modifier
                                            </Button>}
                                            {isChangingPwd && <Waiting className="mt-md" name={"loading"} />}
                                            {errorModifyPwd && <Alert color="danger">{errorModifyPwd}</Alert> }
                                        </div>

                                    </Form>
                                </CardBody>
                            </Card>
                        </div>

                    </Modal>
                </Row>
                <Row className="mt-md justify-content-center">
                    <small>D'autres fonctionnalités arrivent bientôt</small>

                </Row>
            </div>

        </>
    )
}

export default ParamPane
