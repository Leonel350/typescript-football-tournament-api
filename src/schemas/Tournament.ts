import { Schema, model } from "mongoose";

const TournamentSchema = new Schema(
   {
      name: { type: String, required: true },
      teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
      matches: [{ type: Schema.Types.ObjectId, ref: "Match" }]
   },
   { timestamps: true }
);

export default model("Tournament", TournamentSchema);
