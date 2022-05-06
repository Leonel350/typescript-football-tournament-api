import { Schema, model } from "mongoose";

const TeamSchema = new Schema({
    name: { type: String, required: true },
    matches: [{ type: Schema.Types.ObjectId, ref: "Match" }],
    badge: { type: String, required: false },
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model("Team", TeamSchema);