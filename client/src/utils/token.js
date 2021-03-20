import jwt_decode from "jwt-decode";

const token = {

    //set the token in the local storage
    setToken : (token)=>{
        localStorage.setItem("token" , token)
    },

    //get the token from local storage
    getToken: ()=>{
        return(localStorage.getItem("token"))
    },

    //destroy the token
    destroyToken: ()=>{
        localStorage.removeItem("token")
        window.location.reload(false);

    },

    getType: ()=>{
        try{
            const decoded = jwt_decode(token.getToken());
            return decoded.type
        }catch (e){
            return 2
        }


    },

    getId:()=>{
        try{
            const decoded = jwt_decode(token.getToken());
            return decoded.userId
        }catch (e){
            return 2
        }
    }

}
export default token


