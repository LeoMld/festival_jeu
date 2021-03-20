import axios from "axios";
import Home from "./Home";
import React, {useState, useEffect} from 'react'
import Person from "../components/person/person"
import CreatePerson from "../components/person/createPerson"

import {
    Button,
    Col, Row,
    Table,Form
} from "reactstrap"
import useAxios from "../utils/useAxios";
import CreateUpdateFestival from "../components/festival/createUpdateFestival";
import Waiting from "../components/utils/Waiting";
function Persons(props){
    let url;
    let [modalState,setModalState] = useState(false)
    //Type = 0 => Exposants
    if(props.type===0){
        url = "/api/gestion/exposants";
    }
    //Type = 1 => Editeurs
    else {
       url = "/api/gestion/editeurs";
    }
    const {data:persons,setData:setPersons,isPending,error} = useAxios(url)
    const addPerson = (newPerson)=>{
        setPersons([...persons,newPerson])
    }
    return(
        <div className={"container justify-content-center"}>
            {<Row className="mb-5 mt-5">
            <Col>
                <h1 className="font-weight-900">Liste des Editeurs</h1>
            </Col>
            <Col>
                <Button
                    color="success"
                    type="button"
                    onClick={() => setModalState(!modalState)}
                >
                    Nouvel Editeur
                </Button>
            </Col>
            <CreatePerson modalState = {modalState} setModalState = {setModalState} type={props.type} addPerson={addPerson}/>
        </Row>}

            <Table className="align-items-center table-bordered" responsive>
                <thead className="thead-light">
                <tr>
                    {props.type===0 &&<th scope="col" rowSpan={2}>Exposant</th>}
                    {
                        props.type===1 && <>
                            <th scope="col" rowSpan={2}>Editeur</th>
                            <th scope="col" rowSpan={2}>Taille entreprise</th>
                        </>
                    }
                    <th scope="col" colSpan={3}>Status</th>
                </tr>
                <tr>
                    <th>Editeur </th>
                    <th>Exposant </th>
                    <th>Exposant Inactif </th>
                </tr>
                </thead>
                <tbody>
                {isPending && <Waiting></Waiting>}
                {persons && persons.map(p=>{
                    return(<Person person={p} type={props.type}/>)
                })}
                </tbody>
            </Table>
        </div>

    )
}

export default Persons;

