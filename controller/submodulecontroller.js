import { SubModule } from "../model/submodulemodel.js";
import { Module } from "../model/modulemodel.js";


export let addSubmodule = async (req,res)=>{

let {name,mid} = req.body

const notes = req.files.notes?.[0]?.originalname || null
const video = req.files.video?.[0]?.originalname || null

await SubModule.create({name,notes,video,mid})

return res.redirect("/mangesubmodule/" + mid)

}
export let submodule = async (req,res)=>{
    let mid = Number(req.params.mid)

    if(isNaN(mid)){
        return res.send("Invalid module id")
    }

    let m = await Module.findOne({ mid })

    res.render("addsubmodule",{ m })
}

export let mangesubmodule = async (req,res)=>{
    let mid = Number(req.params.mid)
    console.log("MID RECEIVED:", req.params.mid)

    if(isNaN(mid)){
        return res.send("Invalid module id")
    }

    let submodules = await SubModule.find({ mid })

    res.render("manageSubmodules",{ submodules })
}

export const editSubmodulePage = async (req,res)=>{
    try{

        let sid = req.params.sid

        let submodule = await SubModule.findOne({_id:sid})

        res.render("edit-submodule",{submodule})

    }catch(err){
        console.log(err)
    }
}

export const updateSubmodule = async (req,res)=>{
  try{

    let sid = req.params.sid

    let {name} = req.body

    const notes = req.files?.notes?.[0]?.originalname
    const video = req.files?.video?.[0]?.originalname

    let sub = await SubModule.findOne({_id:sid})

    await SubModule.updateOne(
      {_id:sid},
      {
        $set:{
          name,
          ...(notes && {notes}),
          ...(video && {video})
        }
      }
    )

    res.redirect("/mangesubmodule/" + sub.mid)

  }catch(err){
    console.log(err)
  }
}

export const deleteSubmodule = async (req,res)=>{
  try{

    let id = req.params.id;

    let sub = await SubModule.findOne({_id:id});

    await SubModule.deleteOne({_id:id});

    res.redirect("/mangesubmodule/" + sub.mid);

  }catch(err){
    console.log(err)
  }
}