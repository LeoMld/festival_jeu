import token from "../../utils/token";
import {Alert, Input} from "reactstrap";
import React, {useState} from "react";
import axios from "axios";

function Contact(props){
    const [error,setError]=useState(false)
    let tokenType=token.getType()
    const handleChangePrincipal = ()=>{
        axios.put("/api/gestion/contact/"+props.c.idContact,{principal:!props.c.principal,idPersonne:props.c.FK_idPersonne},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                if(!props.c.principal===false){
                    let newContacts = putFalse()
                    props.setInfo({...props.info,contacts:newContacts})
                    setError(false)
                }else{
                    let newContacts = changeViewCurrentPrincipal(props.c.idContact)
                    props.setInfo({...props.info,contacts:newContacts})
                    setError(false)
                }

            })
            .catch((e)=>{
                setError(true)
            })
    }
    const changeViewCurrentPrincipal = (idContact) => {
        const newContacts = [...props.info.contacts];
        newContacts.forEach(c => {
            c.principal = (c.idContact === idContact);
        })
        return newContacts
    }
    const putFalse = () => {
        const newContacts = [...props.info.contacts];
        newContacts.forEach(c => {
            c.principal = (c.idContact === 0);
        })
        return newContacts
    }
    return(
        <tr key={props.index} >
            <td className="text-blue" onClick={()=>{
                props.openModal(props.c,0)
            }}>{props.c.nomContact+" - "+props.c.prenomContact}</td>
            <td>
                {props.c.mailContact}
            </td>
            <td>
                {props.c.telPortableContact}
            </td>
            <td>
                <label className="custom-toggle">
                    <Input
                        id="estExposant"
                        disabled={token.getType()!==1}
                        type="checkbox"
                        checked={props.c.principal}
                        onChange={()=>tokenType===1?handleChangePrincipal():{}}
                    />
                    <span className="custom-toggle-slider rounded-circle"/>
                </label>
            </td>
            {error && <Alert color="danger" toggle={()=>{setError(false)}}> Erreur </Alert>}
        </tr>
    )
}
export default Contact;
