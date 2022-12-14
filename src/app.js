import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from "body-parser";
import authRouter from './routes/auth.route.js';
/* import connectToDB from './db.js'; */
import db from './models/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` })

const app = express();
const port = process.env.PORT || 3000;
/* connectToDB(); */
db.sequelize.sync();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));
}
app.use('/auth', authRouter);



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

export default app; // for testing purposes