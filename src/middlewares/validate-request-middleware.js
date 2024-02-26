const ValidateRequest =(schema)=>{
    return (req, res, next)=>{
        try{
            let payload = req.body;
            console.log(payload)
            schema.parse(payload);
            next()
        }catch(exception){
            next(exception)
        }
    }
}

module.exports = ValidateRequest