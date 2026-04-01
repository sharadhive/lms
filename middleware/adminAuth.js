export const adminAuth = (req,res,next)=>{
    let user = req.session.user;
    let hasAdminAccess = req.session.adminAccess === true;

    if(user?.role === "admin" && hasAdminAccess){
        next();
    }else{
        return res.redirect("/admin/login");
    }
}
