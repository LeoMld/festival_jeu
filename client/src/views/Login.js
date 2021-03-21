import React, {useState} from 'react'
import {Container, Button, Alert} from "reactstrap";
import logo from "../assets/images/logo_FDJ_FINAL_800.png"
import axios from "axios";
import token from "../utils/token"
import {useHistory} from "react-router-dom";

function Login() {
    const history = useHistory()

    const [stateEmail, setStateEmail] = useState("");
    const [stateIconEmail, setStateIconEmail] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [erreurConnexion, setErreurconnexion] = useState(false)

    const REGEXEMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    const handleChange = set => event => {
        set(event.target.value)
    }


    const handleCheckMail = event => {
        setEmail(event.target.value)
        if (email.length <= 1) {
            setStateEmail("")
            setStateIconEmail("")
        } else if (email.match(REGEXEMAIL)) {
            setStateEmail("is-valid")
            setStateIconEmail("has-success")
        } else {
            setStateEmail("is-invalid")
            setStateIconEmail("has-danger")
        }
    }

    const onSubmit = () => {
        axios.post('/api/login', {email, password}).then(res => {
            console.log(res.data)
            if (res.data.data.exist && res.data.data.match) {
                token.setToken(res.data.token)
                let path = `/Accueil`;
                history.push(path);
                window.location.reload(false);
            } else {
                setErreurconnexion(true)
            }

        }).catch(() => {
            setErreurconnexion(true)
        })

    }


    return (
        <Container className="mt-md">
            <div className="justify-content-center mb-lg">
                <h1> Connexion</h1>
                <div className="mt-md">
                    {erreurConnexion && <Alert color="danger">
                        Erreur, mauvaise combinaison login/mot de passe
                    </Alert>}
                </div>
                <div className="row">
                    <div className="col-sm mr-md">
                        <img style={{maxWidth: "450px"}} src={logo} alt="logo festival du jeu"/>
                    </div>
                    <div className="col-sm mt-md">
                        <form onSubmit={onSubmit}>
                            <div className={"form-group " + stateIconEmail}>
                                <input onChange={handleCheckMail} value={email} type="text" placeholder="Email"
                                       className={"form-control " + stateEmail}/>
                            </div>
                            <div className="form-group ">
                                <input onChange={handleChange(setPassword)} value={password} type="password"
                                       className="form-control " id="exampleFormControlInput1"
                                       placeholder="Mot de passe"/>
                            </div>
                            <button onClick={() => {
                                onSubmit()
                            }} type="button" className="btn btn-success mt-sm-4"
                                    disabled={stateEmail === "" || stateEmail === "is-invalid"}>Se connecter
                            </button>
                        </form>

                    </div>
                </div>

            </div>
        </Container>


    )
}

export default Login;
