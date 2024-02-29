const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { models } = require('../sequelize');
const bcrypt = require('bcrypt');

const validateUser = async (email, password, done) => {

    try {
        const user = await models.user.findOne({
            where: {
                email: email,
            },
            include :{ 
                model : models.role,
                attributes : ['description']
            }
        });


        if (!user) {
            return done(null, false, {
                message: "Wrong email or password",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            return done(null, user.toJSON());
        }
        else {
            return done(null, false, {
                
                message: "Wrong email or password",
            });
        }

    } catch (error) {
        console.log(error);
        done(error);
    }
}


const strategy = new LocalStrategy({
    usernameField: 'email',
}, validateUser,
);


passport.use(strategy);




passport.serializeUser((user, done) => {
    return done(null, user.id_user);
});



passport.deserializeUser((userID, done) => {
    models.user.findByPk(userID,{
        attributes : ['id_user', 'username', 'score', 'rank', 'imagePath'],
        include :{ 
        model : models.role,
        attributes : ['description']
    }
    }).then(
        (user) => {
            done(null, user.toJSON());
        }
    ).catch(
        err => done(err)
    )

});