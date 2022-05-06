import {Schema, model} from "mongoose";

const MatchSchema = new Schema({
    tournament: {type: Schema.Types.ObjectId, ref: "Tournament"},
    team1: {type: Schema.Types.ObjectId, ref: "Team"},
    team2: {type: Schema.Types.ObjectId, ref: "Team"},
    score1: {type: Number, default: 0},
    score2: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

export default model("Match", MatchSchema);