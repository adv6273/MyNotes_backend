
const jwt=require('jsonwebtoken');
const JWT_SECRET= "aditya is a very goood comder";

const fetchuser=( req,res,next)=>{
    // GET THE USER FROM THE JWT TOKEN AND ADD ID TO REQUEST  OBJECT
    const token= req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error : " Please authenticate using a valid token"})
    }
    
    try {
        
        const data =jwt.verify(token,JWT_SECRET);
        req.user =data.user;
        next()
    } catch (error) {
        
        res.status(401).send({error : " Internal Server Error"})
    }
}

module.exports= fetchuser;