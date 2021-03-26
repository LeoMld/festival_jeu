const jwt = require('jsonwebtoken');

// Retrieve the status of the user connected, if there is any
getStatus = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SIGN)

        if (decoded.type) {
            return await decoded.type
        } else {
            return 2
        }
    } catch (err) {
        return 2
    }
}

module.exports = {
    //CAN REFRESH TOKEN WITH A SET TIMEOUT OF EXP - 10S when you get the jwtTOken

    //generate a token, put him in localStorage
    connect: async (id, type) => {
        return await jwt.sign({
            userId: id,
            type: type
        }, process.env.JWT_SIGN, {
            expiresIn: '15s'
        })

    },
    createRefreshToken : async (id,type)=>{
       return await jwt.sign({
            userId: id,
            type: type
        }, process.env.refresh_token,{
           expiresIn: '3d'
       })
    },

    // Retrieve the status of the user connected, if there is any
    getStatus: async (token) => {
        return await getStatus(token)
    },

    // Retrieve the id of the user connected, if there is any
    getId: async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SIGN)
            if (decoded.userId) {
                return await decoded.userId
            } else {
                return 0
            }
        } catch (err) {
            return 0
        }
    },

    privateRoute: async (req, res, next) => {
        try {
            if (await getStatus(req.headers.authorization) !== (0 || 1)) {
                res.status(401).json({code: 0})
            } else {
                next();
            }
        } catch (e) {
            console.log(e)
        }
    },


}
