import React, {useState} from "react";
import token from "../../utils/token";
import Selector from "../utils/Selector";
import ModalGame from "./ModalGame";
import ModalDelete from "./ModalDelete";


function Game(props){



    //the state to see a game trough a modal
    const [modalState, setModalState] = useState(false)

    //state representing the game selected (displayed in the modal)
    const [gameModal, setGameModal] = useState()

    //state representing the modal to delete a game
    const [deleteModal, setDeleteModal] = useState(false)



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
    return(

            <tr key={props.index}>
                <td className="text-center">{props.index}</td>
                <td>{props.game.libelleJeu}</td>
                <td>{props.game.nombreJoueur}</td>
                <td>{props.game.ageMinimum}</td>
                <td>{props.game.duree}</td>
                <td>{props.game.nomPersonne}</td>
                <td>{props.game.libelleTypeJeu}</td>
                {token.getType() === 1 && <Selector game={props.game} games={props.games} setGames={props.setGames}  url={'/api/games/'+props.game.idJeu} bool={props.game.prototype}/>}
                {token.getType() === 1 && <td className="td-actions text-right d-flex">
                    <button type="button" rel="tooltip" className="btn btn-info btn-icon btn-sm "
                            data-original-title="" title="modify game" onClick={() => openModal(props.game)}>
                        <i className="ni ni-circle-08 pt-1"/>
                    </button>
                    <button type="button" rel="tooltip" className="btn btn-danger btn-icon btn-sm "
                            data-original-title="" title="delete game" onClick={() => {
                                    openDeleteModal(props.game)
                            }
                    }>
                        <i className="ni ni-fat-remove pt-1"/>
                    </button>
                </td>}
                {props.games && token.getType() === 1 && <ModalGame games={props.games} setGames={props.setGames} game={props.game} setGame={props.setGame} modalState={modalState} setModalState={setModalState} type={props.type}/>}
                {props.games && gameModal && token.getType() === 1 && <ModalDelete games={props.games} setGames={props.setGames} game={props.game}  deleteModal={deleteModal} setDeleteModal={setDeleteModal} type={props.type}/>}


            </tr>



    )
}
export default Game
