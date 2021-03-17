import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Persons from "../../views/Persons";

function Person(props){
    const [person,setPerson]=useState(props.person)

    return(
        <tr>
            <td>
                {person.nomPersonne}
            </td>
            {
                person.estEditeur &&
                <td>
                    {person.statutEditeur}
                </td>
            }
            <td>
                <div>
                    <input type="checkbox" id="editeur" name="estEditeur" value={person.estEditeur} checked={person.estEditeur}/>
                    <label htmlFor="editeur"> Editeur</label>
                    <br/>
                    <input type="checkbox" id="exposant" name="estEditeur" value={person.estExposant} checked={person.estExposant}/>
                    <label htmlFor="exposant"> Exposant</label>
                </div>
            </td>
        </tr>
    )
}
export default Person;

