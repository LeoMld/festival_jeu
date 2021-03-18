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

    isAdmin : async (token)=>{
        jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
            console.log(decoded.type)
            return decoded.type === 1
        })
    },

    isOrganisateur: async (token)=>{
        jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
            console.log(decoded.type)
            return decoded.type === 0
        })
    }
}
