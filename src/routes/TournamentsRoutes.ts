import { Request, Response, Router } from "express";
import Tournament from "../schemas/Tournament";
import { body, validationResult } from "express-validator";

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
      const tournament = await Tournament.findById(req.params.id).populate("teams").populate("matches");
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
      const tournament = await Tournament.findById(req.params.id);
      //generar tabla
      res.json(tournament);
   }

   routes() {
      this.router.get("/", this.getTournaments);
      this.router.get("/:id", this.getTournament);
      this.router.post("/", body("name").isString(), this.createTournamet);
      this.router.put("/:id", body("name").isString(), this.updateTournament);
      this.router.delete("/:id", this.deleteTournament);
   }
}

const tournamentRoutes = new TournamentRoutes();
export default tournamentRoutes.router;
