import jwt_decode from "jwt-decode";
import axios from "axios";

const token = {

    //set the token in the local storage
    setToken : async (token)=>{
        await localStorage.setItem("token" , token)
    },
    setRefreshToken : (token) =>{
        localStorage.setItem("refreshToken" , token)
    },

    //get the token from local storage
    getToken: ()=>{
        return(localStorage.getItem("token"))
    },
    getRefreshToken: ()=>{
        return(localStorage.getItem("refreshToken"))
    },

    //destroy the token
    destroyToken: ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.reload(false);

    },

    getType: ()=>{
        try{
            const decoded = jwt_decode(token.getToken());
            return decoded.type
        }catch (e){
            let RT = localStorage.getItem("refreshToken")
            if(RT){
                 axios.post("/api/token",{token:RT})
                    .then(async (res)=>{
                        await token.setToken(res.data.accessToken)
                        await token.setRefreshToken(res.data.refreshToken)
                        return jwt_decode(res.data.accessToken)
                    })
            }else{

                return 2
            }
        }

    },

    getId:()=>{
        try{
            const decoded = jwt_decode(token.getToken());
            return decoded.userId
        }catch (e){
            return 2
        }
    },
    getExp:()=>{
        try{
            const decoded = jwt_decode(token.getToken());
            return decoded.exp
        }catch (e){
            return e
        }
    },
    getTokenExp(token){
        try{
            const decoded = jwt_decode(token);
            return decoded.exp
        }catch (e){
            return e
        }
    }

}
export default token


