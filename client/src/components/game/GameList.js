import React, {useState, useEffect} from 'react'

import {
    Container, Modal, Button, Alert
} from 'reactstrap';
import useAxios from "../../utils/useAxios";
import Waiting from '../utils/Waiting'
import ModalGame from '../game/ModalGame'
import Selector from "../utils/Selector";
import Axios from "axios";



function GameList(props) {


    //the state to see a game trough a modal
    const [modalState, setModalState] = useState(false)

    //state representing the game selected (displayed in the modal)
    const [gameModal, setGameModal] = useState()

    //states related to all the games
    const {data: games, setData: setGames, isPending, error} = useAxios("/api/games")

    //if there is an error when deleting
    const [errorDeleting , setErrorDeleting] = useState(false)

    const openModal = (game) =>{
        setModalState(!modalState)
        setGameModal(game)

    };

    //TODO delete a game
    const deleteGame = (idJeu)=>{
        /*Axios.delete('/api/games/'+idJeu)
            .then(res => {
                props.setModalState(!props.modalState)
                setIsChanging(false)
            }).catch(e => {
            setIsChanging(false)
            setError(true)
        })*/
    }


    return(

        <Container className="justify-content-center" >

            <table className="table table-striped">
                <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Titre</th>
                    <th className="d-none d-lg-table-cell">Nombre de joueurs</th>
                    <th className="d-none d-lg-table-cell">Âge minimum</th>
                    <th className="d-none d-lg-table-cell">Durée</th>
                    {props.isAdmin && <th >Prototype</th>}
                    {props.isAdmin && <th >Action</th>}

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
                                {props.isAdmin && <Selector url={'/api/games/'+game.idJeu} bool={game.prototype}/>}
                                {props.isAdmin && <td className="td-actions text-right d-flex">
                                    <button type="button" rel="tooltip" className="btn btn-info btn-icon btn-sm "
                                            data-original-title="" title="modify game" onClick={() => openModal(game)}>
                                        <i className="ni ni-circle-08 pt-1"></i>
                                    </button>
                                    <button type="button" rel="tooltip" className="btn btn-danger btn-icon btn-sm "
                                            data-original-title="" title="delete game">
                                        <i className="ni ni-fat-remove pt-1"></i>
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

            {games && <ModalGame game={gameModal} setGame={setGameModal} modalState={modalState} setModalState={setModalState}/>}
            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert> }


        </Container>
    )

}

export default GameList
