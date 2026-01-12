const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("Token received:", token);
        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).json({
                    message: "Invalid or Expired Token",
                    error: true,
                    success: false
                });
            }

            console.log("Decoded Token Data:", decoded);
            req.userId = decoded._id || decoded.id;//yoooooooooo

            next();
        });

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports = authToken;


// const jwt = require('jsonwebtoken')

// async function authToken(req,res,next){
//     try{
//         const token = req.cookies?.token

//         console.log("token",token)
//         if(!token){
//             return res.status(200).json({
//                 message : "Please Login...!",
//                 error : true,
//                 success : false
//             })
//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
//             console.log(err)
//             console.log("decoded",decoded)
            
//             if(err){
//                 console.log("error auth", err)
//             }

//             req.userId = decoded?._id

//             next()
//         });


//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             data : [],
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = authToken