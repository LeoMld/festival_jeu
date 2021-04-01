import React, {useEffect, useState} from 'react'
import {Button, Card, CardBody, CardFooter, Collapse, Row, Table} from "reactstrap";
import Pagination from "react-js-pagination";

function EditorGames(props) {

    const [collapse, setCollapse] = useState(false)

    const [nbPagin, setNbPagin] = useState(1)
    const [gamesToDisplay, setGamesToDisplay] = useState([])

    useEffect(()=>{
        const indexDebut = (nbPagin-1)*5
        const indexFin = (props.editorGames.games.length <= nbPagin*5-1) ? props.editorGames.games.length : nbPagin*5
        let gamesPage = []
        for(let i = indexDebut; i<indexFin; i++){
            gamesPage.push(props.editorGames.games[i])
        }
        setGamesToDisplay(gamesPage)
    },[nbPagin, props.zones])

    return (
        <div>
            <div className="btn-wrapper  my-4">
                <Button block color="default" onClick={() => setCollapse(!collapse)}>
                    {props.editorGames.nomPersonne} : {props.editorGames.games.length} {props.editorGames.games.length > 1 ? "jeux" : "jeu"}
                </Button>
            </div>
            <Collapse
                isOpen={collapse}
            >
                <Card>
                    <CardBody>
                        <h2 className="text-left font-weight-bold">Jeux exposés</h2>
                        <Table className="table-light table-striped table-bordered table-active">
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Joueurs</th>
                                <th>Âge min</th>
                                <th>Durée</th>
                                <th>Type</th>
                                <th>Prototype</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.editorGames.games && gamesToDisplay.map((game, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="align-middle">{game.libelleJeu}</td>
                                        <td className="align-middle">{game.nombreJoueur}</td>
                                        <td className="align-middle">{game.ageMinimum}</td>
                                        <td className="align-middle">{game.duree}</td>
                                        <td className="align-middle">{game.libelleTypeJeu}</td>
                                        <td className="align-middle">
                                            <i style={{"font-size": "3rem"}}
                                               className={game.prototype ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                        </td>
                                    </tr>)
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                    <CardFooter>
                        {props.editorGames.games && nbPagin &&
                        <Row className="justify-content-center mt-md">
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={nbPagin}
                                itemsCountPerPage={5}
                                totalItemsCount={props.editorGames.games.length}
                                pageRangeDisplayed={5}
                                onChange={(pageNumber)=>{setNbPagin(pageNumber)}}
                                getPageUrl={(nb) => {
                                    return nb.toString()
                                }}
                            />
                        </Row>
                        }
                    </CardFooter>
                </Card>
            </Collapse>
        </div>
    )
}

export default EditorGames;