import "./config/env.js";
import express from "express"
import { router } from "./route/router.js"
import { connectDB } from "./config/db.js";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app=express()
const PORT = process.env.PORT || 8000;
app.set("view engine","ejs")
app.set("views","./views")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))


app.use(session({
  name: "lms.sid",
  secret: process.env.SESSION_SECRET || 'change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
}));

app.use((req, res, next) => {
  const sessionUser = req.session.user || null;

  res.locals.user = sessionUser;
  res.locals.username = sessionUser?.username || null;
  res.locals.role = sessionUser?.role || null;
  res.locals.isAuthenticated = Boolean(sessionUser);
  res.locals.isAdminAuthenticated = Boolean(
    sessionUser &&
    sessionUser.role === "admin" &&
    req.session.adminAccess === true
  );
  res.locals.msg = req.session.flash || null;
  res.locals.currentRoute = req.path;

  delete req.session.flash;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Save or lookup user in DB here
    return done(null, profile);
  }
  ));
} else {
  console.warn("Google OAuth is disabled. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.");
}

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((user, done) => {
done(null, user);
});

  app.use("/",router)

  
try {
  await connectDB();
  app.listen(PORT,()=>console.log(`server started ${PORT}`))
} catch (error) {
  console.error("MongoDB connection error:", error.message);
  process.exit(1);
}
