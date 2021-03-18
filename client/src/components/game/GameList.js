import React, {useState, useEffect} from 'react'

import {
    Container, Modal, Button
} from 'reactstrap';
import useAxios from "../../utils/useAxios";
import Waiting from '../utils/Waiting'
import ModalGame from '../game/ModalGame'
import SelectorPrototype from "./SelectorPrototype";



function GameList(props) {

    //the state to see a game trough a modal
    const [modalState, setModalState] = useState(false)

    //state representing the game selected (displayed in the modal)
    const [gameModal, setGameModal] = useState()

    //states related to all the games
    const {data: games, setData: setGames, isPending, error} = useAxios("/api/game/allGames")

    const openModal = (game) =>{
        setModalState(!modalState)
        setGameModal(game)

    };


    return(

        <Container className="justify-content-center" >

            <table className="table table-striped">
                <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Titre</th>
                    <th>Nombre de joueurs</th>
                    <th>Âge minimum</th>
                    <th>Durée</th>
                    {props.isAdmin && <th >Prototype</th>}
                    {props.isAdmin && <th >Action</th>}

                </tr>
                </thead>
                <tbody className="hidden-xs-down">

                    {games && games.data.map((game, index) => {
                        return(
                            <tr >
                                <td className="text-center">{index}</td>
                                <td>{game.libelleJeu}</td>
                                <td>{game.nombreJoueur}</td>
                                <td>{game.ageMinimum}</td>
                                <td >{game.duree}</td>
                                {props.isAdmin && <SelectorPrototype game={game}/>}
                                {props.isAdmin && <td className="td-actions text-right">
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



        </Container>
    )

}

export default GameList
