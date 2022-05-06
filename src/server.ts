import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import tournamentRouter from "./routes/TournamentsRoutes";
import teamsRouter from "./routes/TeamsRoutes";
import matchesRouter from "./routes/MatchesRoutes";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set("port", process.env.PORT || 3000);
    //Middlewares
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
    this.mongo();
  }

  mongo(): void {
    const MONGO_URI = "mongodb://localhost/footballtournament";
    mongoose
      .connect(MONGO_URI)
      .then((db) => console.log("DB is connected"));
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }

  routes(): void {
    this.app.use("/api/tournaments", tournamentRouter);
    this.app.use("/api/tournaments", teamsRouter);
    this.app.use("/api/tournaments/:tournamentId/matches", matchesRouter);
  }
}

const server = new Server();
server.start();