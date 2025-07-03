// Import required modules..

const express=require("express")         // Import Express.js framework
const path=require("path")              // Module to handle and transform file paths
const bcrypt = require('bcrypt');       // Library for hashing passwords
const collection=require("./mongodb");   // Import the MongoDB collection from a separate file



 const app=express();      //create an express application

// convert data into json format

app.use(express.json());

app.use(express.urlencoded({extented:false}));


//use EJS as the view engine
app.set('view engine','ejs'); 

//static file
app.use(express.static("public"));      // Serve static files (like CSS, JS, images) from the "public" folder

app.get("/",(req,res)=>{                // Define a route for the home page ("/") that renders the login.ejs page
    res.render("login");                //show login page
});

app.get("/register",(req,res)=>{        // Define a route to render the register page when "/register" is visited
    res.render("register");            //show register page
});

// Register user
app.post("/register",async (req,res)=>{     //Handle registration submission

    // Create a user object from the submitted form data
    const data={
        Username:req.body.Username,
        password:req.body.password
    }
    // to check if the user is already exist in the DB
const existingUser=await collection.findOne({Username:data.Username});

if(existingUser){
    res.send("User already exists");    // If user exists, send a response saying so
}
else{
    // hashing password before it storing into the database

    const saltRounds=10;           // Number of salt rounds for bcrypt   
    const hashedPassword=await bcrypt.hash(data.password,saltRounds);
    data.password = hashedPassword;     //replace plain password with hashed one

    // Insert the new user data into the database
    const userdata=await collection.insertMany(data);
    console.log(userdata);                              // log the saved user data 
     
}
});

// login user

app.post("/login",async(req,res)=>{
    try{
        const check=await collection.findOne({Username: req.body.Username});      // Check if the username exists in the database
        if(!check){
            res.send("user name connot found");
        }
    
  // Check if the username exists in the database

    const isPasswordMatch = await bcrypt.compare(req.body.password , check.password);
    if(isPasswordMatch) {
        res.render("home");                      // If match, render the home.ejs page

    }
    else{
        req.send("wrongpassword");              // Password doesn't match
    }
}catch{
        req.send("wrong Details");              // if any error occurs
    }

});

// Set up the server to listen on port 3000
const port=3000;
app.listen(port, () => {
    console.log(`server running on port: ${port}`);
});