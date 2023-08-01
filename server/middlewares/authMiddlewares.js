exports.isAuth = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        next();
    }
    else {
        res.status(401).json({
            message : "You need to login to view this ressource"
        })
    }
}