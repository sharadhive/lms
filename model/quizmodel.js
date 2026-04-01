import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const quizSchema = new mongoose.Schema({
  qid: {
    type: Number,
  },
  name: {
    type: String,
    unique: true,
  },
  options: {
    type: Array
  },
  answer: {
    type: String
  },
  mid: {
    type: Number,
    ref: "module"
  },

});

// Apply the plugin to auto-increment 'cid'
quizSchema.plugin(AutoIncrement, { inc_field: 'qid' });

// Create the model
export const QuizModule = mongoose.model("quizmodule", quizSchema);
