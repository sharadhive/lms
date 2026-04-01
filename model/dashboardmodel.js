import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const dashboardSchema = new mongoose.Schema({
    did: {
      type: Number,
    },
    marks: {
      type: Number,
    },
    name: {
      type: String,
    },
    attempt:{
        type:String,
        default:"first"
    },
    mid:{
        type:Number
    },
    
    eid:{
        type:Number,
        ref:"Enrollment"
    }
  });
  
  // Apply the plugin to auto-increment 'cid'
  dashboardSchema.plugin(AutoIncrement, { inc_field: 'did' });
  dashboardSchema.pre("remove", async function (next) {
      try {
        // Import Module model dynamically here
        const Module = mongoose.model("Module");
        await Module.deleteMany({ did: this.did });
        next();
      } catch (err) {
        next(err);
      }
    });
  
  // Create the model
  export const Dashboard = mongoose.model("dashboard", dashboardSchema);
