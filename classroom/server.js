const express = require("express");
const app = express(); 
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
// const cookieParser = require("cookie-parser");
const session=require("express-session");
const flash= require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const secretCode = "mySecret123";  // for signed cookies
// app.use(cookieParser(secretCode));  // signed cookie support

// // Signed cookie set route
// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", { signed: true });
//     res.send("Signed cookie set");
// });

// // Signed cookie read route
// app.get("/readsignedcookie", (req, res) => {
//     console.log(req.signedCookies); // terminal me dikhega
//     const value = req.signedCookies["made-in"] || "none";
//     res.send(`Signed cookie value: ${value}`);
// });

// // Root route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// // Set normal cookie
// app.get("/setcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.send("Sent you some cookies!");
// });

// // Get normal cookie
// app.get("/getcookies", (req, res) => {
//     console.dir(req.cookies); // terminal me dikhega
//     let { greet = "anonymous" } = req.cookies;
//     res.send(`Hi, ${greet}`);
// });

// // Users & Posts routes
// app.use("/users", users);
// app.use("/posts", posts);
const sessionOptions={
        secret:"mysupersecret",
        resave:false,
        saveUninitialized:true,

    }
app.use(session(sessionOptions)); 
app.use(flash());

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
   req.session.name=name;
   req.flash("success","user registered successfully");
  // console.log(req.session.name);
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{ 
 res.locals.msg= req.flash("success");
res.render("page.ejs",{name:req.session.name});
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//     req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

app.listen(3000, () => {
    console.log("Server is listening to 3000");
});
