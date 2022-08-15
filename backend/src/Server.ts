import express from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";
import * as swaggerUi from "swagger-ui-express";
import cors from 'cors';

export class Server {
	public app: express.Express = express();
	private readonly port: number = 3000;

	constructor() {
		this.app.use(express.json({ limit: 100000000 }));
		this.app.use(cors());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());
		this.app.use(express.static("public"));

		RegisterRoutes(this.app);

		try {
			this.app.use(
				"/docs",
				swaggerUi.serve,
				swaggerUi.setup(undefined, {
					swaggerOptions: {
						url: "/swagger.json",
					},
				}),
			);
		} catch (err) {
			console.log("Unable to load swagger.json", err);
		}
	}

	public async listen(port: number = this.port) {
		const listen = this.app.listen(port, () =>
			console.log(`Listening at http://localhost:${port}/docs`),
		);
		return listen;
	}

}