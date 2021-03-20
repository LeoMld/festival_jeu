import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Persons from "../../views/Persons";
import Selector from "../utils/Selector";

function Person(props){
    const [person,setPerson]=useState(props.person)
    const [exposant,setExposant]=useState(person.estExposant)
    const [editeur,setEditeur]=useState(person.estEditeur)
    const [inactif,setInactif]=useState(person.exposantInactif)
    const handleChangeExposant = (bool)=>{
        axios.put("/api/gestion/editeurs/"+person.idPersonne,{estExposant:bool})
            .then(()=>{
                setPerson({...person,estExposant:bool})
            })
    }
    const handleChangeEditeur = (bool)=>{
        axios.put("/api/gestion/editeurs/"+person.idPersonne,{estEditeur:bool})
            .then(()=>{
                setPerson({...person,estEditeur:bool})
            })
    }
    const handleChangeExposantInactif = (bool)=>{
        axios.put("/api/gestion/editeurs/"+person.idPersonne,{exposantInactif:bool})
            .then(()=>{
                setPerson({...person,exposantInactif:bool})
            })
    }
    return(
        <tr>
            <td>
                {person.nomPersonne}
            </td>
            {
                props.type &&
                <td>
                    {person.statutEditeur}
                </td>
            }
            <td >
                <label className="custom-toggle">
                    <input onChange={()=> {handleChangeEditeur(!person.estEditeur)}} checked={person.estEditeur} type="checkbox" defaultChecked={person.estEditeur}/>
                    <span className="custom-toggle-slider rounded-circle"></span>
                </label>
            </td>
            <td >
                <label className="custom-toggle">
                    <input onChange={()=> {handleChangeExposant(!person.estExposant)}} checked={person.estExposant} type="checkbox" defaultChecked={person.estExposant}/>
                    <span className="custom-toggle-slider rounded-circle"></span>
                </label>
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

