import {
    Button,
    Modal,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Card,
    CardHeader,
    InputGroupAddon,
    Input,
    InputGroupText,
    Label,
    Alert
} from "reactstrap";
import React,{useEffect, useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import token from "../../utils/token";

function ModalDelete(props){

    //if there is an error when deleting
    const [errorDeleting , setErrorDeleting] = useState(false)
    const [isChanging, setIsChanging] = useState(false)

    const deleteGameView = ()=>{
        const newGames = props.games
        newGames.data.forEach(game =>{
            if(game.idJeu === props.game.idJeu){
                //get  "game" index
                const i = newGames.data.indexOf(game);
                newGames.data.splice(i, 1);
            }
        } )
        props.setGames(newGames)
    }



    const deleteGame = ()=>{
        setIsChanging(true)
        Axios.delete('/api/games/'+props.game.idJeu,{ headers: { Authorization: token.getToken() } })
            .then(res => {
                deleteGameView()
                props.setDeleteModal(!props.deleteModal)
                setIsChanging(false)

            }).catch(e => {
            console.log(e)
            setErrorDeleting(true)
            //if the token is not the good one
            if(e.response.data.code === 0){
                token.destroyToken()
            }
        })
    }

    const close = ()=>{
        props.setDeleteModal(!props.deleteModal)
    }

    return(
        <Modal
            className="modal-dialog-centered modal-danger"
            contentClassName="bg-gradient-danger"
            isOpen={props.deleteModal}
            toggle={() => props.setDeleteModal(!props.deleteModal)}
        >
            <div className="modal-header">
                <h6 className="modal-title" id="modal-title-notification">
                    Attention
                </h6>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => close()}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="py-3 text-center">
                    <i className="ni ni-bell-55 ni-3x" />
                    <h4 className="heading mt-4">Veuillez confirmer la deletion</h4>
                    <p>
                        Vous aller supprimer le jeu "{props.game.libelleJeu}"
                    </p>
                </div>
            </div>
            <div className="modal-footer">

                <Button
                    className="text-white ml-auto"
                    color="link"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => close()}
                >
                    Annuler
                </Button>
                {!isChanging && <div className="text-center">
                    <Button
                        onClick={()=>{deleteGame()}}
                        className="my-4"
                        color="primary"
                        type="button"
                    >
                        Supprimer
                    </Button>
                </div>}
                {isChanging && <Waiting className="mt-md" />}
                {errorDeleting && <Alert color="danger">
                    Erreur lors de la deletion, veuillez réessayer plus tard
                </Alert> }
            </div>
        </Modal>
    )
}
export default ModalDelete
