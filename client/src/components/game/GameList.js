import React, {useState, useEffect} from 'react'

import {
    Container, Modal, Button, Alert
} from 'reactstrap';
import useAxios from "../../utils/useAxios";
import Waiting from '../utils/Waiting'
import ModalGame from '../game/ModalGame'
import ModalDelete from '../game/ModalDelete'
import Selector from "../utils/Selector";
import Axios from "axios";
import token from "../../utils/token";
import ModalNewGame from "./ModalNewGame";
import ModalType from "./ModalType";



function GameList(props) {


    //the state to see a game trough a modal
    const [modalState, setModalState] = useState(false)

    //the state to add a type trough a modal
    const [modalTypeState, setModalTypeState] = useState(false)


    //the state for the collapse to see the filters
    const [collapseState, setCollapseState] = useState(false)

    //state representing the game selected (displayed in the modal)
    const [gameModal, setGameModal] = useState()

    //state representing the modal to delete a game
    const [deleteModal, setDeleteModal] = useState(false)

    //states related to all the games
    const {data: games, setData: setGames, isPending, error} = useAxios("/api/games")

    //the state to see "add a game" view trough a modal
    const [modalStateAddGame, setModalStateAddGame] = useState(false)

    //open the modal to add a game
    const openModalAddGame = () =>{
        setModalStateAddGame(!modalStateAddGame)

    };


    //open the modal to modify a game
    const openModal = (game) =>{
        setModalState(!modalState)
        setGameModal(game)
    };

    //open the modal to delete a game
    const openDeleteModal = (game)=>{
        setGameModal(game)
        setDeleteModal(!deleteModal)
    }

    //open the modal to add a type
    const openAddTypeModal = ()=>{
        setModalTypeState(!modalTypeState)
    }




    return(

        <Container className="justify-content-center" >
            <div className="d-flex flex-row-reverse mb-sm-3">

                {games && token.getType() === 1 && <Button onClick={() => openModalAddGame()} color="success" outline type="button">
                    Ajouter un jeu
                </Button>}
                {games && token.getType() === 1 && <Button onClick={() => openAddTypeModal()} className="mr-sm-3" color="info" outline type="button">
                    Gestion des types
                </Button>}
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

                    {games && games.data.map((game, index) => {
                        return(
                            <tr key={index}>
                                <td className="text-center">{index}</td>
                                <td>{game.libelleJeu}</td>
                                <td className="d-none d-lg-table-cell">{game.nombreJoueur}</td>
                                <td className="d-none d-lg-table-cell">{game.ageMinimum}</td>
                                <td className="d-none d-lg-table-cell">{game.duree}</td>
                                {token.getType() === 1 && <Selector url={'/api/games/'+game.idJeu} bool={game.prototype}/>}
                                {token.getType() === 1 && <td className="td-actions text-right d-flex">
                                    <button type="button" rel="tooltip" className="btn btn-info btn-icon btn-sm "
                                            data-original-title="" title="modify game" onClick={() => openModal(game)}>
                                        <i className="ni ni-circle-08 pt-1"/>
                                    </button>
                                    <button type="button" rel="tooltip" className="btn btn-danger btn-icon btn-sm "
                                            data-original-title="" title="delete game" onClick={() => openDeleteModal(game)}>
                                        <i className="ni ni-fat-remove pt-1"/>
                                    </button>
                                </td>}


                            </tr>


                        )
                    })}
                </tbody>
            </table>

            {isPending &&
            <Waiting name={"games"}/>
            }

            {games && token.getType() === 1 && <ModalGame game={gameModal} setGame={setGameModal} modalState={modalState} setModalState={setModalState}/>}
            {games && gameModal && token.getType() === 1 && <ModalDelete games={games} setGames={setGames} game={gameModal}  deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>}
            {games && modalStateAddGame && token.getType() === 1 && <ModalNewGame setGames={setGames} games={games} modalState={modalStateAddGame} setModalState={setModalStateAddGame} />}
            {games && modalTypeState && token.getType() === 1 && <ModalType modalState={modalTypeState} setModalState={setModalTypeState} />}


            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert> }


        </Container>
    )

}

export default GameList
