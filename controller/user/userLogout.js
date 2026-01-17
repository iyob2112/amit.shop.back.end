 async function userLogout(req,res){
    try{
        res.clearCookie("token")
localStorage.removeItem("token");
navigate("/login");

        res.json({
            message : "Logged out successfully",
            error : false,
            success : true,
            data : []
        })
    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}


module.exports = userLogout