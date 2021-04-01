import React, {useState} from 'react'
import Person from "../components/person/person"
import CreatePerson from "../components/person/createPerson"

import {Button, Col, Row, Table} from "reactstrap"
import useAxios from "../utils/useAxios";
import Waiting from "../components/utils/Waiting";
import token from "../utils/token";

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
            <Row className="mb-5 mt-5">
            <Col>
                <h1 className="font-weight-900">Liste des {props.type===1?"Editeurs":"Exposants"}</h1>
            </Col>
                {token.getType() === 1 &&
                <Col>
                    <Button
                        color="success"
                        type="button"
                        onClick={() => setModalState(!modalState)}
                    >
                        Nouvel {props.type === 1 ? "Editeur" : "Exposant"}
                    </Button>
                </Col>}
                {token.getType() === 1 &&   <CreatePerson modalState = {modalState} setModalState = {setModalState} type={props.type} addPerson={addPerson}/> }

        </Row>

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
                {persons && persons.map((p,index)=>{
                    return(<Person person={p} type={props.type} index={index}/>)
                })}
                </tbody>
            </Table>
            <Row className="justify-content-center">
                {isPending && <Waiting name={"chargement des données"}/>}
                {persons && persons.length ===0  && <p className="font-weight-400"> Aucune donnée disponible</p>}
            </Row>
        </div>

    )
}

export default Persons;

