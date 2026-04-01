import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const submoduleSchema = new mongoose.Schema({
    sid: {
      type: Number,
    },
    name: {
      type: String,
      unique: true,
    },
    notes:{
        type:String
    },
    video:{
        type:String
    },
    mid:{
        type:Number,
        ref:"module"
    },
    status:{
        type:String,
        default:"pending"
    }
  });
  
  // Apply the plugin to auto-increment 'cid'
  submoduleSchema.plugin(AutoIncrement, { inc_field: 'sid' });
  
  // Create the model
  export const SubModule = mongoose.model("submodule", submoduleSchema);
