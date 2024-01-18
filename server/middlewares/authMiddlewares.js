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



exports.checkRole = (roles) => {
    return (req, res, next) => {
        if ( roles.includes(req.user.role.description)) {
            next();
        }
        else {
            res.status(403).json({
                message : "You don't have permissions to view this ressource"
            })
        }
    }
}