import { Course } from "../model/coursemodel.js"
import { Module } from "../model/modulemodel.js"
import { SubModule } from "../model/submodulemodel.js"
import { Pdetail } from "../model/paymentdetailmodel.js"
export const addModule = async (req,res)=>{
  try{

    let cid = req.params.cid

    let {name,duration,description} = req.body

    await Module.create({
      name,
      duration,
      description,
      cid
    })

    res.redirect("/manage-modules/"+cid)

  }catch(err){
    console.log(err)
  }
}
export let module=async(req,res)=>{
    let cid=req.params.cid;
    return res.render("addmodule",{cid})
}
export let viewModule=async(req,res)=>{
    let cid=req.params.cid
    let modules=await Module.find({cid})
    let submodules=await SubModule.find()
    let username = req.session.user?.username
    let u = username ? await Pdetail.find({ user: username }) : []
    return res.render("viewmodule",{modules,submodules,u})
}

export const manageModules = async (req, res) => {
    const cid = req.params.cid;
    const modules = await Module.find({ cid }); // fetch modules for this course
    res.render("manageModules", { modules, cid });
  };

  
export const editModulePage = async (req,res)=>{
    try{

        let mid = req.params.mid

        let module = await Module.findOne({_id:mid})

        res.render("edit-module",{module})

    }catch(err){
        console.log(err)
    }
}

export const updateModule = async (req,res)=>{
    try{

        let mid = req.params.mid

        let {name,description,duration} = req.body

        let module = await Module.findOne({_id:mid})

        await Module.updateOne(
            {_id:mid},
            {
                $set:{
                    name,
                    description,
                    duration
                }
            }
        )

        res.redirect("/manage-modules/"+module.cid)

    }catch(err){
        console.log(err)
    }
}

export const deleteModule = async (req, res) => {
  try {

    let id = req.params.mid;

    // find module first to get cid
    let module = await Module.findOne({ _id: id });

    await Module.deleteOne({ _id: id });

    res.redirect("/manage-modules/" + module.cid);

  } catch (err) {
    console.log(err);
    res.send("Error deleting module");
  }
};
