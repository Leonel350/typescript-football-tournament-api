import { Request, Response, Router } from "express";
import Tournament from "../schemas/Tournament";
import Match from "../schemas/Match";
import { body, validationResult } from "express-validator";
import { getWon, getTied, getLost, getPoints } from "../lib/Scores";

class TournamentRoutes {
   router: Router;
   constructor() {
      this.router = Router();
      this.routes();
   }

   public async createTournamet(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }

      const { name } = req.body;
      const tournament = await Tournament.create({ name });
      res.json(tournament);
   }

   public async getTournaments(req: Request, res: Response) {
      const tournaments = await Tournament.find();
      res.json(tournaments);
   }

   public async getTournament(req: Request, res: Response) {
      const tournament = await Tournament.findById(req.params.id)
         .populate("teams")
         .populate("matches");
      res.json(tournament);
   }

   public async updateTournament(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { name } = req.body;
      const tournament = await Tournament.findByIdAndUpdate(
         req.params.id,
         { name },
         { new: true }
      );
      res.json(tournament);
   }

   public async deleteTournament(req: Request, res: Response) {
      const tournament = await Tournament.findByIdAndDelete(req.params.id);
      res.json(tournament);
   }

   public async getTable(req: Request, res: Response) {
      const tournamentData = await Tournament.findById(req.params.id)
         .populate("teams")
         .populate("matches")
         .populate("matches.team1")
         .populate("matches.team2");
      const matchesData = await Match.find({ tournament: req.params.id })
         .populate("team1")
         .populate("team2");
      const table: any = {};
      matchesData.forEach((t) => {
         console.log(t);
         if (!table[t.team1._id]) {
            table[t.team1._id] = {
               team: t.team1.name,
               _id: t.team1._id,
               played: 0,
               won: 0,
               lost: 0,
               tied: 0,
               points: 0,
               goalsFor: 0,
               goalsAgainst: 0,
               goalDifference: 0,
            };
         }
         if (!table[t.team2._id]) {
            table[t.team2._id] = {
               team: t.team2.name,
               _id: t.team2._id,
               played: 0,
               won: 0,
               lost: 0,
               tied: 0,
               points: 0,
               goalsFor: 0,
               goalsAgainst: 0,
               goalDifference: 0,
            };
         }
         table[t.team1._id].played += 1;
         table[t.team1._id].goalsFor += t.score1;
         table[t.team1._id].goalsAgainst += t.score2;
         table[t.team1._id].goalDifference =
            table[t.team1._id].goalsFor - table[t.team1._id].goalsAgainst;
         table[t.team1._id].points += getPoints(t.score1, t.score2);
         table[t.team1._id].won += getWon(t.score1, t.score2);
         table[t.team1._id].lost += getLost(t.score1, t.score2);
         table[t.team1._id].tied += getTied(t.score1, t.score2);
         table[t.team2._id].played += 1;
         table[t.team2._id].goalsFor += t.score2;
         table[t.team2._id].goalsAgainst += t.score1;
         table[t.team2._id].goalDifference =
            table[t.team2._id].goalsFor - table[t.team2._id].goalsAgainst;
         table[t.team2._id].points += getPoints(t.score2, t.score1);
         table[t.team2._id].won += getWon(t.score2, t.score1);
         table[t.team2._id].lost += getLost(t.score2, t.score1);
         table[t.team2._id].tied += getTied(t.score2, t.score1);
         console.log(table);
      });
      const tableArray = Object.keys(table).map((key) => table[key]);
      tableArray.sort((a, b) => {
         if (a.points > b.points) {
            return -1;
         }
         if (a.points < b.points) {
            return 1;
         }
         if (a.goalDifference > b.goalDifference) {
            return -1;
         }
         if (a.goalDifference < b.goalDifference) {
            return 1;
         }
         if (a.goalsFor > b.goalsFor) {
            return -1;
         }
         if (a.goalsFor < b.goalsFor) {
            return 1;
         }
         return 0;
      });

      res.json(tableArray);
   }

   routes() {
      this.router.get("/", this.getTournaments);
      this.router.get("/:id", this.getTournament);
      this.router.post("/", body("name").isString(), this.createTournamet);
      this.router.put("/:id", body("name").isString(), this.updateTournament);
      this.router.delete("/:id", this.deleteTournament);
      this.router.get("/:id/table", this.getTable);
   }
}

const tournamentRoutes = new TournamentRoutes();
export default tournamentRoutes.router;
