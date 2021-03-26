import React, {useState} from 'react'
import axios from 'axios';
import {Link} from "react-router-dom";
import token from "../../utils/token";
import {Alert} from "reactstrap";

function Person(props){
    const [person,setPerson]=useState(props.person)
    const [errorExposant,setErrorExposant]=useState(false)
    const [errorEditeur,setErrorEditeur]=useState(false)
    let url;
    let typePerson
    if(props.type===1){
        url = "/api/gestion/editeurs/"
        typePerson = "Editeurs"
    }else{
        url = "/api/gestion/exposants/"
        typePerson = "Exposants"

    }
    const handleChangeExposant = (bool)=>{
        axios.put(url+person.idPersonne,{estExposant:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,estExposant:bool})
            }).catch(()=>{
                console.log("set")
                setErrorExposant(true)
        })
    }
    const handleChangeEditeur = (bool)=>{
        axios.put(url+person.idPersonne,{estEditeur:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,estEditeur:bool})
            }).catch(()=>{
                console.log("set")
                setErrorEditeur(true)
        })
    }
    const handleChangeExposantInactif = (bool)=>{
        axios.put(url+person.idPersonne,{exposantInactif:bool},{ headers: { Authorization: token.getToken() } })
            .then(()=>{
                setPerson({...person,exposantInactif:bool})
            })
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
                    <input onChange={()=> {handleChangeEditeur(!person.estEditeur)}} checked={person.estEditeur} type="checkbox" defaultChecked={person.estEditeur}/>
                    <span className="custom-toggle-slider rounded-circle"/>
                </label>
                {errorEditeur && <Alert color="danger"> L'Editeur possède encore des jeux</Alert>}

            </td>
            <td >
                <label className="custom-toggle">
                    <input onChange={()=> {handleChangeExposant(!person.estExposant)}} checked={person.estExposant} type="checkbox" defaultChecked={person.estExposant}/>
                    <span className="custom-toggle-slider rounded-circle"/>
                </label>
                {errorExposant && <Alert color="danger"> L'Exposant possède encore des reservations</Alert>}
            </td>
            <td >
                <label className="custom-toggle">
                    <input onChange={()=> {handleChangeExposantInactif(!person.exposantInactif)}} checked={person.exposantInactif} type="checkbox" defaultChecked={person.exposantInactif}/>
                    <span className="custom-toggle-slider rounded-circle"></span>
                </label>
            </td>
        </tr>
    )
}
export default Person;

