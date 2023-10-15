import express, {Request, Response} from 'express';
import path from 'path';
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.get('/', (req: Request, res: Response) => {
    return res.status(200).render('loginPage')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})