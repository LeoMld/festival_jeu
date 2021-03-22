import React, {useState} from 'react'
import {Container,Button} from "reactstrap";
import GameList from "../components/game/GameList";
import ModalGame from "../components/game/ModalGame";
import ModalNewGame from "../components/game/ModalNewGame";
import token from "../utils/token";


function AllGames(){


    return(
        <Container className="container justify-content-center mt-md" style={{minHeight : "500px"}}>
            <h1 className="mb-md font-weight-800">Liste des jeux</h1>

            <GameList />

        </Container>



    )
}

export default AllGames;
