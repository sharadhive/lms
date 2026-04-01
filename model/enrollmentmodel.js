import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const enrollmentSchema = new mongoose.Schema({
    eid: {
      type: Number,
    },
    name: {
      type: String,
      
    },
    email: {
      type: String,
    },
    phone:{
        type:String
    },
    mode:{
        type:String
    },
    cid:{
        type:Number,
        ref:"Course"
    }
  });
  
  // Apply the plugin to auto-increment 'cid'
  enrollmentSchema.plugin(AutoIncrement, { inc_field: 'eid' });
   enrollmentSchema.pre("remove", async function (next) {
      try {
        // Import Module model dynamically here
        const Module = mongoose.model("Module");
        await Module.deleteMany({ eid: this.eid });
        next();
      } catch (err) {
        next(err);
      }
    });
  
  // Create the model
  export const Enrollment = mongoose.model("enrollment", enrollmentSchema);
