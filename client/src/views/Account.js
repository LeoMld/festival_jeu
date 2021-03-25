import React from 'react'
import {Container} from "reactstrap";
import NavAccount from "../components/account/NavAccount";

function Account(){


    return(
        <Container className="container justify-content-center mt-md" style={{minHeight : "500px"}}>
            <h1 className="mb-md font-weight-800">Mon compte</h1>
            <hr/>
            <NavAccount/>

        </Container>



    )
}

export default Account;
