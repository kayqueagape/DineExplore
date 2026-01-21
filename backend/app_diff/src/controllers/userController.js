import {user} from "../models/user.js"


class UserControler {
  
  static async listUser(req,res){
    try{
      const lsUser=await user.find({});
      res.status(200).json(lsUser);

    }catch(err){
      res.status(500).json({message: `${Error.message}- res error`})
    }

  }

}

export default UserControler;