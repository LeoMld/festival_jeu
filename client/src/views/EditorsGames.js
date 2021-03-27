import React from 'react'
import useAxios from "../utils/useAxios";
import {Alert, Col, ListGroup, ListGroupItem, ListGroupItemHeading, Row} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import EditorGames from "../components/person/EditorGames";

function EditorsGames() {

    const {data: editorsGames, setData: setEditorGames, isPending, error} = useAxios('/api/gestion/jeuxEditeur')

    return (
        <div className="justify-content-center mr-7 ml-7">
            <h1 className="font-weight-900 mt-5 mb-5">Liste des éditeurs et de leurs jeux</h1>
            <h2 className="text-left font-weight-300">Navigation rapide</h2>
            {!isPending && editorsGames.length === 0 &&
            <p>Il n'y a rien à afficher pour le moment.</p>}
            <Row>
                <Col>
                    <ListGroup>
                        {!isPending && !error &&
                        editorsGames.map((editor, index) => {
                            if (index % 3 === 0) return (
                                <ListGroupItem tag="a" href={"#" + index.toString()}>
                                    {editor.nomPersonne}
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </Col>
                <Col>
                    {!isPending && !error &&
                    editorsGames.map((editor, index) => {
                        if (index % 3 === 1) return (
                            <ListGroupItem tag="a" href={"#" + index.toString()}>
                                {editor.nomPersonne}
                            </ListGroupItem>
                        )
                    })}
                </Col>
                <Col>
                    {!isPending && !error &&
                    editorsGames.map((editor, index) => {
                        if (index % 3 === 2) return (
                            <ListGroupItem tag="a" href={"#" + index.toString()}>
                                {editor.nomPersonne}
                            </ListGroupItem>
                        )
                    })}
                </Col>
            </Row>
            {error ? <Alert color="danger">
                    {error}
                </Alert> :
                isPending ? <Waiting/> :
                    editorsGames.map((editor, index) => {
                        return (
                            <Row className="mb-3 mt-3" key={index} id={index}>
                                <Col>
                                    <EditorGames editorGames={editor}/>
                                </Col>
                            </Row>
                        )
                    })}
        </div>
    )
}

export default EditorsGames;
