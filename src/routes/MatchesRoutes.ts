import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import Match from "../schemas/Match";
import Tournament from "../schemas/Tournament";
class MatchesRoutes {
   router: Router;
   constructor() {
      this.router = Router();
      this.routes();
   }
   public async validateTournament(req: Request, res: Response, next: any) {
      const tournamentId = req.params.tournamentId;
      console.log(req.params);
      if (await Tournament.exists({ _id: tournamentId })) {
         next();
         return;
      }
      res.status(400).json({
         errors: [{ msg: "Tournament not found" }],
      });
   }
   public async createMatch(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { tournamentId } = req.params;
      const { team1, team2, score1, score2 } = req.body;
      const match = await Match.create({
         tournament: tournamentId,
         team1,
         team2,
         score1,
         score2,
      });
      const tournament = await Tournament.findById(tournamentId);
      tournament.matches.push(match._id);
      await tournament.save();
      res.json(match);
   }
   public async getMatches(req: Request, res: Response) {
      const matches = await Match.find();
      res.json(matches);
   }
   public async getMatch(req: Request, res: Response) {
      const match = await Match.findById(req.params.id);
      res.json(match);
   }
   public async updateMatch(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { tournament, team1, team2, score1, score2 } = req.body;
      const match = await Match.findByIdAndUpdate(
         req.params.id,
         {
            tournament,
            team1,
            team2,
            score1,
            score2,
         },
         { new: true }
      );
      res.json(match);
   }
   public async deleteMatch(req: Request, res: Response) {
      const match = await Match.findByIdAndDelete(req.params.id);
      const tournament = await Tournament.findById(req.params.tournamentId);
      tournament.matches.pull(match._id);
      await tournament.save();
      res.json(match);
   }
   routes() {
      this.router.get("/:tournamentId/matches", this.getMatches);
      this.router.get("/:tournamentId/matches/:id", this.getMatch);
      this.router.post(
         "/:tournamentId/matches",
         body("tournament").isString(),
         body("team1").isString(),
         body("team2").isString(),
         body("score1").isInt(),
         body("score2").isInt(),
         this.createMatch
      );
      this.router.put(
         "/:tournamentId/matches/:id",
         body("tournament").isString(),
         body("team1").isString(),
         body("team2").isString(),
         body("score1").isInt(),
         body("score2").isInt(),
         this.updateMatch
      );
      this.router.delete("/:tournamentId/matches/:id", this.deleteMatch);
   }
}

export default new MatchesRoutes().router;
