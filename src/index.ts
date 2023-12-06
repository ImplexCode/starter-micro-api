import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import { PORT } from './config';
import { updateDeliveryStateAsOffline } from './services/triggerFunctions';

const cron = require('node-cron');

const StartServer = async () => {

    const app = express();

    await dbConnection()

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    })

    // cron.schedule('*/15 * * * * *', () => { 
    //     updateDeliveryStateAsOffline();
    // });

    await App(app);

    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    })
}

StartServer();