import { Course } from "../model/coursemodel.js"
import { Enrollment } from "../model/enrollmentmodel.js"
import { Pdetail } from "../model/paymentdetailmodel.js"
import nodemailer from "nodemailer"
export let enrollment=async (req,res)=>{
    let cid=req.params.cid
    let course=await Course.findOne({cid})
    return res.render("enrollment",{course})
}

export let enrollcourse=async(req,res)=>{
    let courses=await Course.find()
    let name=req.session.user?.username;
    let e=await Enrollment.find({name})
    return res.render("enrollcourse",{courses,e})
}
export let Payment=(req,res)=>{
    let mode=req.params.mode
    let eid=req.params.eid
    return res.render("payment",{mode,eid})
}
export let addEnrollment=async(req,res)=>{
    let{name,email,phone,mode}=req.body;
    let cid=req.params.cid
    let er=await Enrollment.findOne({cid,name})
    if(er){
        return res.redirect("/enrollment/"+cid)
    }
    await Enrollment.create({name,email,phone,mode,cid})
    let e=await Enrollment.findOne({name})
    return res.redirect("/payment/"+mode+"/"+e.eid)
}
export let success=(req,res)=>{
    return res.render("success")
}

export let addPaymentdetail=async(req,res)=>{
    let eid=req.params.eid;
    let sessionUser = req.session.user;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tid = '';
  for (let i = 0; i < 16; i++) {
    tid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
    await Pdetail.create({tid,eid,user:sessionUser?.username})
    const transporter = nodemailer.createTransport(
    {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "carts195@gmail.com",
          pass: "nsrr epiu fxup brkw",
        },
      }
  )
  const mailOptions = {
    from: "carts195@gmail.com",
    to: sessionUser?.email,
    subject: "✅ Your Enrollment Was Successful – Welcome To Quastech!",
    text: `Hi ${sessionUser?.username}, your enrollment was successful.`, // fallback
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Enrollment Confirmed!</h1>
          </div>
  
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px; line-height: 1.5;">Hi Aman,</p>
  
            <p style="font-size: 16px; line-height: 1.5;">
              We're excited to let you know that your enrollment has been successfully processed.
            </p>
  
            <p style="font-size: 16px; line-height: 1.5;">
              You can now access all the features and benefits associated with your registration.
            </p>
  
            <a href="https://yourwebsite.com/dashboard" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Go to Dashboard
            </a>
  
            <p style="margin-top: 30px; font-size: 14px; color: #777;">
              If you have any questions or need support, feel free to reply to this email.
            </p>
  
            <p style="font-size: 14px; color: #777;">Best regards,<br>Your Team</p>
          </div>
  
          <div style="background-color: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; color: #aaa;">
            &copy; 2025 Your Company Name. All rights reserved.
          </div>
  
        </div>
      </div>
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
    return res.redirect("/success")
}
