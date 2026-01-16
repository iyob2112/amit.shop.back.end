const jwt = require('jsonwebtoken');
// authToken middleware - Accept both cookies AND Authorization header
async function authToken(req, res, next) {
  try {
    let token;
    const isMobile = req.headers['user-agent']?.match(/iPhone|iPad|iPod|Android/i);

    // 1. First check Authorization header (mobile fallback)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token from Authorization header");
    }
    // 2. Then check cookies (desktop)
    else if (req.cookies?.token) {
      token = req.cookies.token;
      console.log("Token from cookie");
    }
    // 3. Check query parameter (additional mobile fallback)
    else if (req.query.token && isMobile) {
      token = req.query.token;
      console.log("Token from query param");
    }

    console.log("Token received:", token ? "YES" : "NO");
    
    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        error: true,
        success: false
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    req.userId = user._id;
    req.user = user;
    next();
    
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token",
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
