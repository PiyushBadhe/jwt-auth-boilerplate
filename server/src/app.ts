import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import "../config";
import UserRouter from "./routes/UserRouter";
import PassportMechanism from "./middleware/passport-mechanism";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeApp();
    this.configureMiddleware();
    this.connectRoutes();
  }

  private initializeApp(): void {
    PassportMechanism.initialize(this.app as express.Express);
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    this.app.use(
      session({
        name: "userId",
        secret: "piyush",
        resave: false,
        saveUninitialized: false,
        cookie: {
          // expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hrs
          expires: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
        },
      })
    );
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(this.httpLogger);
  }

  private httpLogger(req: Request, _res: Response, next: NextFunction): void {
    console.debug(`${req.method} ${req.url}`);
    next();
  }

  private connectRoutes(): void {
    const routes = this.routesInstances;

    this.app.use("/user", routes.user); // User routes
  }

  private routesInstances = {
    user: new UserRouter().getRoutes(),
  };
}

export default new App().app;
