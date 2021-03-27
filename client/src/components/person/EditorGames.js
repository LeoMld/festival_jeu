import React, {useState} from 'react'
import {Button, Card, CardBody, Collapse, Table} from "reactstrap";

function EditorGames(props) {

    const [collapse, setCollapse] = useState(false)

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
                            {props.editorGames.games.map((game, index) => {
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
                </Card>
            </Collapse>
        </div>
    )
}

export default EditorGames;