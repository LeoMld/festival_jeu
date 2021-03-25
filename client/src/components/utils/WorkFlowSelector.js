import React from "react";

import workflow from "../../utils/workflow"
import {Input} from "reactstrap";

function WorkFlowSelector(props){

    let state = [0,1,2,3,4,5,6,7,8,9]
    return (
        <Input type="select" name="select" id={props.id} defaultValue={props.selected} onChange={(event)=>props.handleChanges(event)}>
            {props.type && <option value={10} key={10} >{props.type}</option>}
            { state.map((i,index)=>{


                    return( <option value={i} key={index} >{workflow(i)}</option>)

            }
            )}

        </Input>
    )
}
export default WorkFlowSelector
