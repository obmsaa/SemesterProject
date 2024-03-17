import express, { json } from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from "../modules/storageManager.mjs";
import { giveToken } from "./authenticator.mjs";


const LOGIN_API = express.Router();
LOGIN_API.use(express.json());




LOGIN_API.post('/', async (req, res, next) => { 


  const {email, password } = req.body;


  if (!email || !password ) {
  return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields.");
  }

  try {

    //Authenticating user and returning the user id
    const userId = await DBManager.checkUserLogin(email, password);

    if (userId) {
      const token = giveToken(userId);
      return res.status(HTTPCodes.SuccesfullRespons.Ok).send({ token: token });
  } else {
      
      return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Login failed.");
  }
} catch(error) {
  console.error("Error during login:", error);
  return res.status(HTTPCodes.ServerErrorRespons.InternalError).send( "Failed to login user.");
}

});


export default LOGIN_API

