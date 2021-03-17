import axios from "axios";
import Home from "./Home";
import React, {useState, useEffect} from 'react'
import Person from "../components/person/person"

import {
    Table
} from "reactstrap"
import useAxios from "../utils/useAxios";
function Persons(){
    const [type,setType]=useState(1)
    //Type = 0 => Exposants
    //Type = 1 => Editeurs

    const {data:persons,setData:setPersons,isPending,error} = useAxios("/api/gestion/editeurs")
    console.log(persons)
    return(
        <Table className="align-items-center" responsive>
            <thead className="thead-light">
            <tr>
                {type===0 &&<th scope="col">Exposant</th>}
                {
                    type===1 && <>
                    <th scope="col">Editeur</th>
                    <th scope="col">Taille entreprise</th>
                    </>
                }
                <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            {persons && persons.map(p=>{
                return(<Person person={p}/>)
            })}
            </tbody>
        </Table>
    )
}

export default Persons;

