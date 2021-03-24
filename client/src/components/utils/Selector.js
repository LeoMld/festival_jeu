import React from "react";
import axios from "axios";
import token from "../../utils/token";

//selector which takes 3 parameters:

//- value of the boolean to update
//- url to call in the back with the parameter "id"
function Selector(props){


        const changePrototype = ()=>{

            props.game.prototype = !props.game.prototype

            props.setGames(prev => ([...prev, ...[]]))

            const bool = props.game.prototype
            axios.put(props.url,{bool},{ headers: { Authorization: token.getToken() } })
                .catch(err => {
                    console.log("Erreur lors du changement " + err)
                    if(err.response.data.code === 0){
                        token.destroyToken()
                    }
                })
    }

    return(
        <td >
            <label className="custom-toggle">
                <input onChange={()=> {changePrototype()}} checked={props.game.prototype} type="checkbox" />
                <span className="custom-toggle-slider rounded-circle"></span>
            </label>
        </td>
    )
}

export default Selector
