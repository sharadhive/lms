import { mongoose } from "../config/db.js"

let user=mongoose.Schema({
    "username":{
        type:"string",
        unique:true
    },
    "email":{
        type:"string"
    },
    "password":{
        type:"string"
    },
    "role":{
        type:"string",
        enum:["student","admin"],
        default:"student"
    }
})

export let User=mongoose.model("user",user)
