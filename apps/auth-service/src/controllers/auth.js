import { AuthModel } from "../models/auth.js";
import { sendBadRequest, sendSuccess } from "@myorg/common";
import { errorHelper } from "@myorg/common";
import {messages} from "@myorg/common";
export const registration = (req,res) =>{
    try{
      const data = req.body
      new AuthModel(data)
      return sendSuccess(res, messages.registrationSuccess)
    }catch(e){
        return sendBadRequest(res, errorHelper(e, "REGISTRATION"));
    }
}