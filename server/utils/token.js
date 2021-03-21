const jwt = require('jsonwebtoken');

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

    //generate a token, put him in localStorage
    connect: async (req, res, id, type) => {
        return await jwt.sign({
            userId: id,
            type: type
        }, process.env.JWT_SIGN, {
            expiresIn: '1h'
        })

    },


    getStatus: async (token) => {
        return await getStatus(token)
    },


    privateRoute: async (req, res, next) => {
        try {
            if (await getStatus(req.headers.authorization) !== (1)) {
                res.status(401).json({code: 0})
            } else {
                next();
            }
        } catch (e) {
            console.log(e)
        }
    }
}
