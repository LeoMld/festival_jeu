const jwt = require('jsonwebtoken');

module.exports = {

    //generate a token, put him in localStorage
    connect: async (req,res,id,type)=> {
        const token = await jwt.sign({
            userId: id,
            type: type
        }, process.env.JWT_SIGN, {
            expiresIn: '1h'
        });

        return token

    },


    getStatus: async (token)=>{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SIGN)

            if(decoded.type){
                console.log(decoded.type)
                return await decoded.type
            }else{
                console.log("je suis ici")
                return 2
            }
        }catch (err){
            return 2
            console.log(err)
        }



    }
}
