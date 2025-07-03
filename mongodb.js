//import the mongoose library
const mongoose=require("mongoose");

// Connect to the MongoDB database named "LOGIN" on your local machine
const connect=mongoose.connect("mongodb://localhost:27017/LOGIN");

//check if the database connection was successful

connect.then(()=>{
    console.log("Database connected successfully");
})
.catch(()=>{
    console.log("Database Cannot be connected");
});

// Define a schema for the Login data (structure of documents in the collection)
const LoginSchema=new mongoose.Schema({
        Username:{
            type:String,    //data type is string 
            required:true   //field is required
        },
        password:{
            type:String,    //data type is string 
            required:true   //field is required
        }

});

// Create a Mongoose model called 'users' based on the LoginSchema
// This will map to the 'users' collection in MongoDB
const collection = new mongoose.model('users',LoginSchema);  
       
// Export the collection (model) so it can be used in other files
module.exports=collection;