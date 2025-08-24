import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({ storage });   // multer({storage:storage}) so same variables , we write one only

export default upload;