import express, { json } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import jwt from "jsonwebtoken";


const LOGIN_API = express.Router();
LOGIN_API.use(express.json());




LOGIN_API.post('/', async (req, res, next) => { 
    SuperLogger.log("Code is running here in LOGIN_API.post")
  const {email, password } = req.body;
  SuperLogger.log("Request body", email, password);

  if (!email || !password ) {
  return res.status(HTTPCodes.BadRequest).send("Missing required fields.");
  }

  try {
    const userAuthenticated = await DBManager.checkUserLogin(email, password);
    SuperLogger.log("Auth Result: ", userAuthenticated);

    if (userAuthenticated) {
        SuperLogger.log("USER AUTHENTICATED!!!")

      const secret = process.env.ACCESS_TOKEN_SECRET;
      const token = jwt.sign({ email }, secret, { expiresIn: '3h' });
    SuperLogger.log("Here is token:", token)
      return res.status(HTTPCodes.SuccesfullRespons.Ok).send({ token });

    } else {
        SuperLogger.log("Error in Login.mjs");

      return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Login failed.");
    }
  
  } catch(error) {

    res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to login user.");
    
  }

});

function logoutUser(){
    localStorage.removeItem('authToken');

};

export default LOGIN_API

