module.exports = {
    sendErrorNumber : (req,res,varName)=>{
        res.status(400).json({
            error:{
                name:varName + " is not a Number.",
                source:varName
            }
        })
    }
}
