import React from 'react'
import {Container} from "reactstrap";
import GameList from "../components/game/GameList";


function AllGames(){

    //appel au middleware pour savoir si l'utilisateur courant est admin
    const isAdmin = true;

    return(
        <Container className="container justify-content-center mt-md" style={{minHeight : "500px"}}>
            <h1 className="mb-md">Tous les jeux</h1>
            <GameList isAdmin={isAdmin}/>
        </Container>



    )
}

export default AllGames;
