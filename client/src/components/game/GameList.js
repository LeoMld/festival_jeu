import React, {useState, useEffect} from 'react'

import {
    Container, Modal, Button, Alert, Col, Row, UncontrolledCollapse, Card, CardBody
} from 'reactstrap';
import useAxios from "../../utils/useAxios";
import Waiting from '../utils/Waiting'
import ModalGame from '../game/ModalGame'
import ModalDelete from '../game/ModalDelete'
import Selector from "../utils/Selector";
import token from "../../utils/token";
import ModalNewGame from "./ModalNewGame";
import ModalType from "./ModalType";
import CollapseFilter from "./CollapseFilter";
import Game from "./Game"


function GameList() {

    //the state to add a type trough a modal
    const [modalTypeState, setModalTypeState] = useState(false)


    //states related to all the games
    const {data: games, setData: setGames, isPending, error} = useAxios("/api/games")

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
                            {games && <CollapseFilter games={games} setGames={setGames}/>}
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Titre</th>
                    <th className="d-none d-lg-table-cell">Nombre de joueurs</th>
                    <th className="d-none d-lg-table-cell">Âge minimum</th>
                    <th className="d-none d-lg-table-cell">Durée</th>
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
