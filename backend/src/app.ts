import express, { Request, Response, NextFunction } from 'express';
import bodyParser, { BodyParser } from 'body-parser';
import postRoutes from './routes/blogPost';
import commentRoutes from './routes/comment'
import authRoutes from './routes/auth'
import mongoose from 'mongoose';
import multer, { FileFilterCallback , Multer} from 'multer'
import path from 'path'
import {StatusError} from '../src/helper/statusError';
const { v4: uuidv4 } = require('uuid');
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


const app = express();
const port = 3000;

const fileStorage  = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null,path.join(__dirname, '../src/images'));
    },

    filename: (
        req: Request, 
        file: Express.Multer.File, 
        callback: FileNameCallback
    ): void => {
        callback(null, uuidv4()+ '.jpg');
    }
})


const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

app.use(bodyParser.json());
app.use(multer ({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use('/feedComments', commentRoutes);
app.use('/feed',postRoutes);
app.use('/auth', authRoutes);


app.use((error:  StatusError, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status : number  = error.status;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
}
)

mongoose.connect('mongodb+srv://chiricaliviu:VRsmM2uTPJNOrpGl@cluster0.ivxlpxe.mongodb.net/blog').then(result =>{
    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
      });
      
}).catch(err => console.log(err));

