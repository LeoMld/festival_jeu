import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {Link} from "react-router-dom";
import token from "../../utils/token";
import {Alert} from "reactstrap";

function Person(props){


    const [person,setPerson]=useState(props.person)

    let tokenType = token.getType()
    let url;
    let typePerson
    if(props.type===1){
        url = "/api/gestion/editeurs/"
        typePerson = "Editeurs"
    }else{
        url = "/api/gestion/exposants/"
        typePerson = "Exposants"

    }
    const [errorExposant,setErrorExposant]=useState(false)
    const [errorEditeur,setErrorEditeur]=useState(false)

    useEffect(()=>{
        setPerson(props.person)

    },[props.person])

    const handleChangeExposant = (bool)=>{
        axios.put(url+person.idPersonne,{estExposant:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,estExposant:bool})
            }).catch(()=>{
                setErrorExposant(true)
        })
    }
    const handleChangeEditeur = (bool)=>{
        axios.put(url+person.idPersonne,{estEditeur:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,estEditeur:bool})
            }).catch(()=>{
                setErrorEditeur(true)
        })
    }
    const handleChangeExposantInactif = (bool)=>{
        axios.put(url+person.idPersonne,{exposantInactif:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,exposantInactif:bool})
            })
    }
    const badLuck = ()=>{
        console.log("Nice Try")
    }
    return(
        <tr key={props.index}>
            <td>
                <Link to={{
                    pathname: "/" + typePerson + "/" + person.idPersonne,
                    personProps:person
                }}>{person.nomPersonne}</Link>
            </td>
            {
                props.type===1 &&
                <td>
                    {person.statutEditeur}
                </td>
            }
            <td >
                <label className="custom-toggle">
                    <input
                        onChange={()=> {tokenType===1?handleChangeEditeur(!person.estEditeur):badLuck()}}
                        checked={person.estEditeur}
                        type="checkbox"
                        defaultChecked={person.estEditeur}
                        disabled={tokenType!==1}
                    />
                    <span className="custom-toggle-slider rounded-circle"/>
                </label>
                {errorEditeur && <Alert color="danger" toggle={()=>{setErrorEditeur(false)}}> L'Editeur poss??de encore des jeux</Alert>}

            </td>
            <td >
                <label className="custom-toggle">
                    <input
                        onChange={()=> {tokenType===1?handleChangeExposant(!person.estExposant):badLuck()}}
                        checked={person.estExposant}
                        type="checkbox"
                        defaultChecked={person.estExposant}
                        disabled={tokenType!==1}

                    />
                    <span className="custom-toggle-slider rounded-circle"/>
                </label>
                {errorExposant && <Alert color="danger" toggle={()=>{setErrorExposant(false)}}> L'Exposant poss??de encore des reservations</Alert>}
            </td>
            <td >
                <label className="custom-toggle">
                    <input
                        onChange={()=> {tokenType===1?handleChangeExposantInactif(!person.exposantInactif):badLuck()}}
                        checked={person.exposantInactif}
                        type="checkbox"
                        defaultChecked={person.exposantInactif}
                        disabled={tokenType!==1}
                    />
                    <span className="custom-toggle-slider rounded-circle"></span>
                </label>
            </td>
        </tr>
    )
}
export default Person;

