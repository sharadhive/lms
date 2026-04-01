import { Course } from "../model/coursemodel.js"
export let addCourse=async(req,res)=>{
    let{name,duration,fees}=req.body
    let image=req.file.originalname
    await Course.create({name,duration,fees,image})
    return res.redirect("/course")
   
    
}

export let course=(req,res)=>{
    return res.render("addcourse")
}

export let viewCourse=async(req,res)=>{
    let courses=await Course.find()
    return res.render("viewcourse",{courses})
}

export const manageCourses = async (req, res) => {
    const courses = await Course.find(); // fetch all courses from DB
    res.render("manageCourses", { courses }); // render EJS or HTML page
  };

  export const editCoursePage = async (req,res)=>{
    try{

        let cid = req.params.cid

        let course = await Course.findOne({_id:cid})

         res.render("edit-course",{course})

    }catch(err){
        console.log(err)
    }
}

export const updateCourse = async (req,res)=>{
    try{

        let cid = req.params.cid

        let {name,duration,fees} = req.body

        await Course.updateOne(
            {_id:cid},
            {
                $set:{
                    name,
                    duration,
                    fees
                }
            }
        )

        res.redirect("/manage-courses")

    }catch(err){
        console.log(err)
    }
}


  export const deleteCourse = async (req,res)=>{
    let cid=req.params.cid

    await Course.deleteOne({cid})

    return res.redirect("/manage-courses")
}