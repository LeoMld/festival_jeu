import React, {useState, useEffect} from 'react'

import {
    Table,
    Button,
    Modal,
    Card,
    CardHeader,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    CardBody,
    Col,
    Row, Container
} from 'reactstrap';



function GameList(canModify) {
    const [listGames, setListGames] = useState(
        [{
            libelleJeu: "",
            nombreJoueur : 4,
            ageMinimum : 5,
            duree : ""
        }]
    )

    //on get la liste des jeux
    useEffect(() => {
        // get liste des jeux
        setListGames([{
            libelleJeu: "Leo",
                nombreJoueur : 4,
                ageMinimum : 5,
                duree : "20 min"
        },
        {
            libelleJeu: "Lea",
            nombreJoueur : 4,
            ageMinimum : 5,
            duree : "20 min"

        }]

        )
    });

    return(

        <Container>
            <table className="table">
                <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Titre</th>
                    <th>Nombre de joueurs</th>
                    <th>Âge minimum</th>
                    <th>Durée</th>


                </tr>
                </thead>
                <tbody>

                    {listGames.map((game, index) => {
                        return(
                            <tr>
                                <td className="text-center">{index}</td>
                                <td>{game.libelleJeu}</td>
                                <td>{game.nombreJoueur}</td>
                                <td>{game.ageMinimum}</td>
                                <td >{game.duree}</td>


                            </tr>


                        )
                    })}
                </tbody>
            </table>

            <button type="button" className="btn btn-primary" data-toggle="modall"
                    data-target=".bd-example-modal-lg">Large modal
            </button>

            <div className="modall fade bd-example-modal-lg" tabIndex="-1" role="dialog"
                 aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        ...
                    </div>
                </div>
            </div>
        </Container>
    )

}

export default GameList
