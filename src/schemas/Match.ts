import { Schema, model } from "mongoose";

const MatchSchema = new Schema(
   {
      tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
      team1: { type: Schema.Types.ObjectId, ref: "Team" },
      team2: { type: Schema.Types.ObjectId, ref: "Team" },
      score1: { type: Number },
      score2: { type: Number },
   },
   { timestamps: true }
);

export default model("Match", MatchSchema);
