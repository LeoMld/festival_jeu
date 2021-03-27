import token from "../../utils/token";

function Contact(props){

    return(
        <tr key={props.index} onClick={()=>{
            if(token.getType()===1){
                props.openModal(props.c,0)
            }
        }}>
            <td>{props.c.nomContact+" - "+props.c.prenomContact}</td>
            <td>
                {props.c.mailContact}
            </td>
            <td>
                {props.c.telPortableContact}
            </td>
        </tr>
    )
}
export default Contact;
