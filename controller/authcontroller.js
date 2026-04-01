import { User } from "../model/usermodel.js"
import bcrypt from 'bcrypt'

const buildSessionUser = (user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
})

const findValidUser = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user) {
        return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return null
    }

    return user
}

export let register=(req,res)=>{
    return res.render("register")
}

export let login=(req,res)=>{
    return res.render("login",{
        formAction: "/login",
        isAdminLogin: false,
        error: null,
    })
}

export const adminLoginPage = (req,res) => {
    return res.render("login", {
        formAction: "/admin/login",
        isAdminLogin: true,
        error: null,
    })
}

export const registerAdminApi = async (req, res) => {
    try {
        let { username, email, password } = req.body

        username = username?.trim()
        email = email?.trim().toLowerCase()

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "username, email and password are required",
            })
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Admin username or email already exists",
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const adminUser = await User.create({
            username,
            email,
            password: hashpassword,
            role: "admin",
        })

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: adminUser._id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export let addUser=async(req,res)=>{
    let {username,email,password}=req.body
    let hashpassword=await bcrypt.hash(password,10)
    await User.create({username,email,password:hashpassword})
    return res.redirect("/login")
}

export let chcekLogin=async(req,res)=>{
    let{username,password}=req.body;
    let u=await findValidUser(username, password)

    if(!u){
        return res.status(401).render("login", {
            formAction: "/login",
            isAdminLogin: false,
            error: "Invalid username or password.",
        })
    }

    req.session.user = buildSessionUser(u)
    req.session.adminAccess = false

    return res.redirect("/")
}

export const adminLogin = async (req,res) => {
    let { username, password } = req.body
    let u = await findValidUser(username, password)

    if (!u || u.role !== "admin") {
        return res.status(403).render("login", {
            formAction: "/admin/login",
            isAdminLogin: true,
            error: "Admin credentials are required for this area.",
        })
    }

    req.session.user = buildSessionUser(u)
    req.session.adminAccess = true

    return res.redirect("/admin")
}

export let logout=(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            return res.redirect("/")
        }

        res.clearCookie("lms.sid")
        return res.redirect("/login")
    })
}
