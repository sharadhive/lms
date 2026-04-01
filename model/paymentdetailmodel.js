import { mongoose } from "../config/db.js"

import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const pdetailSchema = new mongoose.Schema({
    pid: {
      type: Number,
    },
    tid: {
      type: String,
      
    },
    eid: {
      type: Number,
      ref:"Enrollment"
    },
    date:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default:"pending"
    },
    user:{
      type:String
    }
    
  });
  
  // Apply the plugin to auto-increment 'cid'
  pdetailSchema.plugin(AutoIncrement, { inc_field: 'pid' });
   pdetailSchema.pre("remove", async function (next) {
      try {
        // Import Module model dynamically here
        const Module = mongoose.model("Module");
        await Module.deleteMany({ pid: this.pid });
        next();
      } catch (err) {
        next(err);
      }
    });
  
  // Create the model
  export const Pdetail = mongoose.model("pdetail", pdetailSchema);
