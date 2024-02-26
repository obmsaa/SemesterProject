import express, { json } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import hash from "../modules/pswHasher.mjs";




const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];





USER_API.get('/:id', async (req, res, next) => {



  const userId = req.params.id;
  
  try {
    const user = await DBManager.findUserById(userId);
    SuperLogger.log(`User found: ${!!user}`)
    if (!user) {
      //404 Error for when it doesn't find the user by id
      return res.status(HTTPCodes.ClientSideErrorRespons.NotFound).end();
    }
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(user).end();
  } catch (error) {
    throw new Error(error);

  }



})

USER_API.post('/', async (req, res, next) => { 

  const { name, email, password } = req.body;

 

  const role = 'user';

  if (!name || !email|| !password ) {
  return res.status(HTTPCodes.BadRequest).send("Missing required fields.");
  }

  try {
    const userExists = await DBManager.checkUserExists(email);
    

    if (userExists) {
      return res.status(HTTPCodes.ClientSideErrorRespons.Conflict).send("User Already Exists", userExists);
    } 

    //Hash the password before storing
    let pswHash = hash(password);
    
    
    let user = new User({
      name: name,
      email: email,     
      role: role,       
      password: pswHash
    });

      await user.save();

    res.status(HTTPCodes.SuccesfullRespons.Created).json(user).end();
    console.log("Registration successful", user, HTTPCodes.SuccesfullRespons.Created);
  } catch(error) {

    res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to register user.");
    
  }

});


USER_API.put('/:id', (req, res) => {
  /// TODO: Edit user
  const user = new User(); //TODO: The user info comes as part of the request 
  user.save();
})

USER_API.delete('/:id', (req, res) => {
  /// TODO: Delete user.
  const user = new User(); //TODO: Actual user
  user.delete();
})

export default USER_API