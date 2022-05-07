import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import Match from "../schemas/Match";
import Team from "../schemas/Team";
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

      if (
         isValidObjectId(tournamentId) &&
         (await Tournament.exists({ _id: tournamentId }))
      ) {
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
      const team1Data = await Team.findById(team1);
      const team2Data = await Team.findById(team2);
      team1Data.matches.push(match._id);
      await team1Data.save();
      team2Data.matches.push(match._id);
      await team2Data.save();
      res.json(match);
   }
   public async getMatches(req: Request, res: Response) {
      const matches = await Match.find()
         .populate("team1", "name")
         .populate("team2", "name");
      res.json(matches);
   }
   public async getMatch(req: Request, res: Response) {
      const match = await Match.findById(req.params.id).populate("team1").populate("team2");
      res.json(match);
   }
   public async validateTeams(req: Request, res: Response, next: any) {
      const { team1, team2 } = req.body;
      if (
         isValidObjectId(team1) &&
         isValidObjectId(team2) &&
         (await Team.exists({ _id: team1 })) &&
         (await Team.exists({ _id: team2 }))
      ) {
         next();
         return;
      }
      res.status(400).json({
         errors: [{ msg: "Invalid teams" }],
      });
   }
   public async updateMatch(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { score1, score2 } = req.body;
      const match = await Match.findByIdAndUpdate(
         req.params.id,
         {
            score1,
            score2,
         },
         { new: true }
      );
      res.json(match);
   }
   public async deleteMatch(req: Request, res: Response) {
      const match = await Match.findByIdAndDelete(req.params.id);
      if (!match) {
         res.status(400).json({
            errors: [{ msg: "Match not found" }],
         });
         return;
      }
      const tournament = await Tournament.findById(req.params.tournamentId);
      tournament.matches.pull(match._id);
      await tournament.save();
      const team1 = await Team.findById(match.team1);
      const team2 = await Team.findById(match.team2);
      if (team1) {
         team1.matches.pull(match._id);
         await team1.save();
      }
      if (team2) {
         team2.matches.pull(match._id);
         await team2.save();
      }
      res.json(match);
   }
   routes() {
      this.router.get(
         "/:tournamentId/matches",
         this.validateTournament,
         this.getMatches
      );
      this.router.get(
         "/:tournamentId/matches/:id",
         this.validateTournament,
         this.getMatch
      );
      this.router.post(
         "/:tournamentId/matches",
         body("team1").isString(),
         body("team2").isString(),
         body("score1").isInt(),
         body("score2").isInt(),
         this.validateTournament,
         this.validateTeams,
         this.createMatch
      );
      this.router.put(
         "/:tournamentId/matches/:id",
         body("score1").isInt(),
         body("score2").isInt(),
         this.validateTournament,
         this.updateMatch
      );
      this.router.delete(
         "/:tournamentId/matches/:id",
         this.validateTournament,
         this.deleteMatch
      );
   }
}

export default new MatchesRoutes().router;
