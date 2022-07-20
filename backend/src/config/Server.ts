import express from 'express';
import bodyParser from "body-parser";
import { RegisterRoutes } from "../../build/routes";
import * as swaggerUi from 'swagger-ui-express';

export class Server {
    public app: express.Express = express();
    private readonly port: number = 3000;

    constructor() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());

        try {
            let swaggerDocument = require('../../swagger.json');
            this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        } catch (err) {
            console.log('Unable to load swagger.json', err);
        }

        RegisterRoutes(this.app);
    }

    public async listen(port: number = this.port) {
        const listen = this.app.listen(port, () =>
            console.log(`Listening at http://localhost:${port}`)
        );
        return listen;
    }

}