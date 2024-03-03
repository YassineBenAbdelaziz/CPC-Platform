const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        // const newUser = {
        //     username: req.user.username,
        //     fname: req.body.fname,
        //     lname: req.body.lname,
        //     password: req.body.password,
        // }

        // const userInstance = models.user.build(newUser);

        callback(null, true);
        // userInstance.validate()
        //     .then((data) => {
        //         callback(null, true);
        //     })
        //     .catch((err) => {
        //         callback(err, false);
        //     });
    }
    else {
        callback(new Error('File is not an image'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter,
});

module.exports = upload.single('userImage');