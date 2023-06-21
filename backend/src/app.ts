import express from 'express';
import bodyParser, { BodyParser } from 'body-parser';
import postRoutes from './routes/blogPost';
import mongoose from 'mongoose';


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
console.log(bodyParser.json())
app.use('/feed',postRoutes);

mongoose.connect('mongodb+srv://chiricaliviu:VRsmM2uTPJNOrpGl@cluster0.ivxlpxe.mongodb.net/blog').then(result =>{
    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
      });
      
}).catch(err => console.log(err));
// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });

