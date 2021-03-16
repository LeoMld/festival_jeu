import React,{useState} from 'react'
import {Container} from "reactstrap";
import logo from "../assets/images/logo_FDJ_FINAL_800.png"

function Login(){

    const [stateEmail, setStateEmail] = useState("");
    const [stateIconEmail, setStateIconEmail] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const REGEXEMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    /*const handleChange = set => event => {
        set(event.target.value)
    }*/

    const handleCheckMail = event => {
        setEmail(event.target.value)
        if(email.length <= 1){
            setStateEmail("")
            setStateIconEmail("")
        }else if(email.match(REGEXEMAIL)){
            setStateEmail("is-valid")
            setStateIconEmail("has-success")
        }else{
            setStateEmail("is-invalid")
            setStateIconEmail("has-danger")
        }
    }



    return(
        <Container className = "mt-md" >
            <div className="justify-content-center mb-lg">
                <h1> Se connecter</h1>
                <div className="row">
                    <div className="col">
                        <img style={{maxWidth : "70%"}} src={logo} alt="logo festival du jeu"/>
                    </div>
                    <div className="col mt-md">

                        <div className={"form-group "+ stateIconEmail}>
                            <input onChange={handleCheckMail} value={email} type="text" placeholder="Email" className={"form-control "+ stateEmail}/>
                        </div>
                        <div className="form-group ">
                            <input value={password} type="password" className="form-control " id="exampleFormControlInput1" placeholder="Mot de passe"/>
                        </div>
                    </div>
                </div>

            </div>
        </Container>



    )
}

export default Login;