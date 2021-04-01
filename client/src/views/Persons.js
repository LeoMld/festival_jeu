import React, {useEffect, useState} from 'react'
import Person from "../components/person/person"
import CreatePerson from "../components/person/createPerson"

import {Button, Col, Row, Table} from "reactstrap"
import useAxios from "../utils/useAxios";
import Waiting from "../components/utils/Waiting";
import token from "../utils/token";
import Pagination from "react-js-pagination";

function Persons(props){
    let url;
    let [modalState,setModalState] = useState(false)

    const [nbPagin, setNbPagin] = useState(1)

    const [personsToDisplay, setPersonsToDisplay] = useState([])




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


    useEffect(()=>{
        if(persons){
            const indexDebut = (nbPagin-1)*10
            const indexFin = (persons.length <= nbPagin*10-1) ? persons.length: nbPagin*10
            let personsPage = []
            for(let i = indexDebut; i<indexFin; i++){
                personsPage.push(persons[i])
            }
            setPersonsToDisplay(personsPage)
        }

    },[nbPagin,persons])

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
                {persons && personsToDisplay.map((p,index)=>{
                    return(<Person person={p} type={props.type} index={index}/>)
                })}
                </tbody>
            </Table>
            <Row className="justify-content-center">
                {isPending && <Waiting name={"chargement des données"}/>}
                {persons && persons.length ===0  && <p className="font-weight-400"> Aucune donnée disponible</p>}
            </Row>
            {persons && <Row className="justify-content-center mt-md">
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={nbPagin}
                    itemsCountPerPage={10}
                    totalItemsCount={persons.length}
                    pageRangeDisplayed={5}
                    onChange={(pageNumber)=>{setNbPagin(pageNumber)}}
                    getPageUrl={(nb) => {
                        return nb
                    }}
                />
            </Row>}

        </div>

    )
}

export default Persons;

