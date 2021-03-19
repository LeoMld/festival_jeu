
module.exports = {

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
    }

}
