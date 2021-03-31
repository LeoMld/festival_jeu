import React, {useState} from 'react'

import {Alert, Button, Card, CardBody, Col, Container, Row, UncontrolledCollapse} from 'reactstrap';
import useAxios from "../../utils/useAxios";
import Waiting from '../utils/Waiting'
import token from "../../utils/token";
import ModalNewGame from "./ModalNewGame";
import ModalType from "./ModalType";
import CollapseFilter from "./CollapseFilter";
import Game from "./Game"


function GameList() {

    //the state to add a type trough a modal
    const [modalTypeState, setModalTypeState] = useState(false)
    let routeGames= ""
    if(token.getType()!==2){
        routeGames = "/api/games"
    }else{
        routeGames = "/api/games/FestivalCourant"
    }
    //states related to all the games
    const {data: games, setData: setGames, isPending, error} = useAxios(routeGames)

    //get all types of game
    const {data: types} = useAxios("/api/games/TypesJeux")


    //the state to see "add a game" view trough a modal
    const [modalStateAddGame, setModalStateAddGame] = useState(false)

    //open the modal to add a game
    const openModalAddGame = () =>{
        setModalStateAddGame(!modalStateAddGame)

    };

    //open the modal to add a type
    const openAddTypeModal = ()=>{
        setModalTypeState(!modalTypeState)
    }

    return(

        <Container className="justify-content-center" >
            <Row>
                <Col  className="d-flex flex-row mb-sm-3">
                    <Button id="toggler" color="info"  type="button">
                        Filtres
                    </Button>
                </Col>
                <Col className="d-flex flex-row-reverse mb-sm-3">
                    {games && token.getType() === 1 && <Button onClick={() => openModalAddGame()} color="success" outline type="button">
                        Ajouter un jeu
                    </Button>}
                    {games && token.getType() === 1 && <Button onClick={() => openAddTypeModal()} className="mr-sm-3" color="info" outline type="button">
                        Gestion des types
                    </Button>}
                </Col>
            </Row>
            <div>
                <UncontrolledCollapse toggler="#toggler">
                    <Card>
                        <CardBody>
                            {games && types && <CollapseFilter types={types.data} games={games} setGames={setGames}/>}
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </div>
            <table className="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Titre</th>
                    <th>Nombre de joueurs</th>
                    <th>Âge minimum</th>
                    <th>Durée</th>
                    <th>Editeur</th>
                    <th>Type</th>
                    {token.getType() === 1 && <th >Prototype</th>}
                    {token.getType() === 1 && <th >Action</th>}

                </tr>
                </thead>
                <tbody>

                    {games && games.map((game, index) => {
                        return(
                            <Game games={games} setGames={setGames} index={index} game={game}/>

                        )
                    })}
                </tbody>
            </table>
            {games && games.length === 0 && <Row className="justify-content-center">Il n'y a pas encore de jeux prévu</Row>}


            {isPending &&
            <Waiting name={"games"}/>
            }

            {games && modalStateAddGame && token.getType() === 1 && <ModalNewGame setGames={setGames} games={games} modalState={modalStateAddGame} setModalState={setModalStateAddGame} />}
            {games && modalTypeState && token.getType() === 1 && <ModalType modalState={modalTypeState} setModalState={setModalTypeState} />}


            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert> }


        </Container>
    )

}

export default GameList
