import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, 'uploads/')
    // }
    destination: "./public",
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = new multer({ storage: storage });

export default upload;