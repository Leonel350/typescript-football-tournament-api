import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import Team from "../schemas/Team";
import Tournament from "../schemas/Tournament";

class TeamsRoutes {
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
   public async createTeam(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { name, badge } = req.body;
      const { tournamentId } = req.params;
      const tournamentData = await Tournament.findById(tournamentId);
      let createObject: any = {};
      createObject.tournament = tournamentId;
      if (req.body.hasOwnProperty("badge")) {
         createObject.badge = badge;
      }
      createObject.name = name;
      const team = await Team.create(createObject);
      tournamentData.teams.push(team._id);
      await tournamentData.save();
      res.json(team);
   }

   public async getTeams(req: Request, res: Response) {
      const teams = await Team.find({ tournament: req.params.tournamentId });
      res.json(teams);
   }

   public async getTeam(req: Request, res: Response) {
      const team = await Team.findById(req.params.id).populate({
         path: 'matches',
         populate: { path: 'team1 team2', select: 'name' },
     });
      res.json(team);
   }
   public async updateTeam(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
      }
      const { name, badge } = req.body;
      let editObject: any = {};
      if (req.body.hasOwnProperty("badge")) {
         editObject.badge = badge;
      }
      if (req.body.hasOwnProperty("name")) {
         editObject.name = name;
      }
      console.log(JSON.stringify(editObject));
      if (editObject.length === 0) {
         res.status(400).json({
            errors: [{ msg: "Cannot update the team" }],
         });
      }

      const team = await Team.findByIdAndUpdate(req.params.id, editObject, {
         new: true,
      });
      res.json(team);
   }

   public async deleteTeam(req: Request, res: Response) {
      const team = await Team.findByIdAndDelete(req.params.id);
      if (team) {
         const tournamentData = await Tournament.findById(team.tournament);
         tournamentData.teams.pull(team._id);
         await tournamentData.save();
         return res.json(team);
      }
      res.status(400).json({
         errors: [{ msg: "Team not found" }],
      });
   }
   routes() {
      this.router.get(
         "/:tournamentId/teams/",
         this.validateTournament,
         this.getTeams
      );
      this.router.get(
         "/:tournamentId/teams/:id",
         this.validateTournament,
         this.getTeam
      );
      this.router.post(
         "/:tournamentId/teams",
         body("name").isString(),
         this.validateTournament,
         this.createTeam
      );
      this.router.put(
         "/:tournamentId/teams/:id",
         this.validateTournament,
         this.updateTeam
      );
      this.router.delete(
         "/:tournamentId/teams/:id",
         this.validateTournament,
         this.deleteTeam
      );
   }
}
export default new TeamsRoutes().router;
