import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const moduleSchema = new mongoose.Schema({
    mid: {
      type: Number,
    },
    name: {
      type: String,
      unique: true,
    },
    duration: {
      type: String,
    },
    description:{
      type:String
    },
    
    cid:{
        type:Number,
        ref:"Course"
    }
  });
  
  // Apply the plugin to auto-increment 'cid'
  moduleSchema.plugin(AutoIncrement, { inc_field: 'mid' });
   moduleSchema.pre("remove", async function (next) {
      try {
        // Import Module model dynamically here
        const Module = mongoose.model("Module");
        await Module.deleteMany({ mid: this.mid });
        next();
      } catch (err) {
        next(err);
      }
    });
  
  // Create the model
  export const Module = mongoose.model("module", moduleSchema);
