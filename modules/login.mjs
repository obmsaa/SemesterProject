import express, { json } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import { giveToken } from "./authenticator.mjs";


const LOGIN_API = express.Router();
LOGIN_API.use(express.json());




LOGIN_API.post('/', async (req, res, next) => { 

    // SuperLogger.log("Code is running here in LOGIN_API.post")
    // console.log("Request headers: ",req.headers); 
    // console.log("Request body",req.body);

  const {email, password } = req.body;


  if (!email || !password ) {
  return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields.");
  }

  try {

    //Authenticating user and returning the user id
    const userId = await DBManager.checkUserLogin(email, password);

    if (userId) {
      console.log(" console User id: ", userId)
      const token = giveToken(userId);
      console.log("Here is token:", token)
      return res.status(HTTPCodes.SuccesfullRespons.Ok).send({ token: token });
  } else {
      SuperLogger.log("Error in Login.mjs");
      return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Login failed.");
  }
} catch(error) {
  res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to login user.");
}

});


export default LOGIN_API

