import express, { Router } from "express"
import { home } from "../controller/studentcontroller.js"
import { register, login, addUser, chcekLogin, logout, adminLoginPage, adminLogin, registerAdminApi } from "../controller/authcontroller.js"
import { addCourse, course, viewCourse, manageCourses, deleteCourse, updateCourse, editCoursePage } from "../controller/coursecontroller.js"
import { admin } from "../controller/admincontroller.js"
import { module, addModule, viewModule, manageModules, editModulePage, updateModule, deleteModule } from "../controller/modulecontroller.js"
import { SubModule } from "../model/submodulemodel.js"
import multer from "multer"
import { adminAuth } from "../middleware/adminAuth.js"
import { submodule, addSubmodule, mangesubmodule, editSubmodulePage, updateSubmodule, deleteSubmodule } from "../controller/submodulecontroller.js"
import { enrollment, enrollcourse, addEnrollment, Payment, success, addPaymentdetail } from "../controller/enrollmentcontroller.js"
import { quiz, addquiz, viewQuiz, checkAnswer, editQuiz, updateQuiz, deleteQuiz, manageQuiz } from "../controller/quizcontroller.js"
import { dashboard, viewdashboard, viewcertificate } from "../controller/dashboardcontroller.js"
import passport from "passport"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
export const router = express.Router()
router.get("/", home)
router.get("/register", register)
router.get("/login", login)
router.post("/register", addUser)
router.post("/login", chcekLogin)
router.get("/admin/login", adminLoginPage)
router.post("/admin/login", adminLogin)
router.post("/admin/register-api", registerAdminApi)
router.get("/logout", logout)
//course route
router.get("/course", adminAuth, course)
router.post("/course", adminAuth, upload.single("image"), addCourse)
router.get("/viewcourse", viewCourse)
router.get("/manage-courses", adminAuth, manageCourses);


router.get("/delete-course/:cid", adminAuth, deleteCourse)
router.get("/edit-course/:cid", adminAuth, editCoursePage)
router.post("/edit-course/:cid", adminAuth, updateCourse)

//admin route
router.get("/admin", adminAuth, admin)


//module route
router.get("/module/:cid", adminAuth, module)
router.post("/module/:cid", adminAuth, addModule)
// router.get("/viewmodule/:cid", adminAuth, viewModule)
router.get("/viewmodule/:cid", viewModule)
router.get("/manage-modules/:cid", adminAuth, manageModules);

router.get("/delete-module/:mid", adminAuth, deleteModule)

router.get("/edit-module/:mid", adminAuth, editModulePage)
router.post("/edit-module/:mid", adminAuth, updateModule)


//submodule route
router.get("/submodule/:mid", adminAuth, submodule)
router.post("/submodule", adminAuth, upload.fields([
  { name: 'notes', maxCount: 10 },  // maxCount is optional
  { name: 'video', maxCount: 10 }
]), addSubmodule)
router.get("/mangesubmodule/:mid", adminAuth, mangesubmodule)

router.get("/delete-submodule/:id", adminAuth, deleteSubmodule)

router.get("/edit-submodule/:sid", adminAuth, editSubmodulePage)
router.post(
  "/edit-submodule/:sid",
  adminAuth,
  upload.fields([
    { name: 'notes', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  updateSubmodule
)


//enrollment route
router.get("/enrollment/:cid", enrollment)
router.get("/enrollcourse", enrollcourse)
router.post("/addenrollment/:cid", addEnrollment)
router.get("/payment/:mode/:eid", Payment)
router.get("/success", success)
router.get("/addpaymentdetail/:eid", addPaymentdetail)

// QUIZ ROUTES

// ADMIN
router.get("/quiz/:mid", adminAuth, quiz)
router.post("/quiz/:mid", adminAuth, addquiz)

router.get("/manage-quiz/:mid", adminAuth, manageQuiz)

router.get("/edit-quiz/:qid", adminAuth, editQuiz)  // i did it
router.post("/edit-quiz/:qid", adminAuth, updateQuiz)

router.get("/delete-quiz/:qid", adminAuth, deleteQuiz)


// STUDENT
router.get("/viewquiz/:mid", viewQuiz)   //    /viewquiz/:mid/attemptquiz
router.post("/submitanswer/:mid", checkAnswer)

//dashboard route
router.get("/viewdashboard/:mid", viewdashboard)

//certificate route
router.get("/certificate", viewcertificate)




router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    const email = req.user?.emails?.[0]?.value || null

    req.session.user = {
      id: req.user?.id || email || req.user?.displayName,
      username: req.user?.displayName || email?.split("@")[0] || "Google User",
      email,
      role: "student",
    }
    req.session.adminAccess = false

    res.redirect("/")
  }
);
