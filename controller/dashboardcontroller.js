import { Enrollment } from "../model/enrollmentmodel.js";
import { Dashboard } from "../model/dashboardmodel.js";
import { Course } from "../model/coursemodel.js";
import { Module } from "../model/modulemodel.js";

export let dashboard = (req, res) => {
    return res.render("studentdashboard");
};

export let viewdashboard = async (req, res) => {
    try {

        let mid = req.params.mid;
        let name = req.session.user?.username;

        if (!name) {
            return res.redirect("/login");
        }

        let e = await Enrollment.findOne({ name });
        let d = await Dashboard.find({ name });

        // USER NOT ENROLLED
        if (!e) {
            return res.render("studentdashboard", {
                notEnrolled: true,
                name,
                c: null,
                m: [],
                d: []
            });
        }

        let c = await Course.findOne({ cid: e.cid });
        let m = await Module.find({ cid: c.cid });

        return res.render("studentdashboard", {
            e,
            d,
            c,
            m,
            mid,
            notEnrolled: false
        });

    } catch (err) {
        console.error("Error in viewdashboard:", err);
        return res.status(500).send("Internal Server Error");
    }
};

export let viewcertificate = async (req, res) => {

    let name = req.session.user?.username;

    let d = await Dashboard.findOne({ name });

    if (!d) {
        return res.send("Certificate not available");
    }

    let m = await Module.findOne({ mid: d.mid });

    return res.render("certificate", { d, m });
};
