import React,{useState, useEffect} from "react";
import axios from "axios";
import token from "../../utils/token";

//selector which takes 3 parameters:

//- value of the boolean to update
//- url to call in the back with the parameter "id"
function Selector(props){
    const[isON, setIsON] = useState(props.bool)

        const changePrototype = ()=>{

            setIsON(!isON)
            const bool = !isON


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
                <input onChange={()=> {changePrototype()}} checked={isON} type="checkbox" defaultChecked={isON}/>
                <span className="custom-toggle-slider rounded-circle"></span>
            </label>
        </td>
    )
}

export default Selector
