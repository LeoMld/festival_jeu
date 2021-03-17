import React,{useState, useEffect} from "react";
import axios from "axios";

function SelectorPrototype(props){
    const[isPrototype, setIsPrototype] = useState(props.game.prototype)



    const changePrototype = (game)=>{

        setIsPrototype(!isPrototype)
        game.prototype = !game.prototype

        axios.put('/api/game/changePrototype',{game})
            .catch(err => {
                console.log("Erreur lors du changement du type du prototype" + err)
            })
    }

    return(
        <td >
            <label className="custom-toggle">
                <input onChange={()=> {changePrototype(props.game)}}  type="checkbox" defaultChecked={isPrototype}/>
                <span className="custom-toggle-slider rounded-circle"></span>
            </label>
        </td>
    )
}

export default SelectorPrototype
