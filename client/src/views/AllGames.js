import React from 'react'
import {Container} from "reactstrap";
import GameList from "../components/game/GameList";


function AllGames(){


    return(
        <Container className="container justify-content-center mt-md" style={{minHeight : "500px"}}>
            <h1 className="mb-md font-weight-800">Liste des jeux</h1>

            <GameList  />

        </Container>



    )
}

export default AllGames;
