import jwt from "jsonwebtoken"
import bycrypt from 'bcryptjs'
import users from "../models/auth.js";
export const signup = async (req,res) => {
  const {name,email,password,date,ip} = req.body;
  console.log(req.body);
  try{
    const existinguser = await users.findOne({email});
    if(existinguser){
      return res.status(404).json({message: "User already exists."})
    }

    const hashedPassword = await bycrypt.hash(password,12)
    const newUser = await users.create({name,email,password: hashedPassword,dob:date,ip})
    const token = jwt.sign({email:newUser.email,id:newUser._id},"vamshi",{expiresIn:"1h"});
    res.status(200).json({result:newUser,token})
  } catch(error){
    res.status(500).json("Something went wrong...")
  }
}

export const login = async (req,res) => {
  console.log(req.body)
  const {email,password} = req.body;
  try {
    const existinguser = await users.findOne({email});
    if(!existinguser){
      return res.status(404).json({message:"User does not exist."})
    }
    const isPasswordCrt = await bycrypt.compare(password,existinguser.password);
    if(!isPasswordCrt){
      return res.status(400).json({message:"Invalid credentials"})
    }
    const token = jwt.sign({email:existinguser.email,id:existinguser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.status(200).json({result:existinguser,token})
  }catch(error) {
    res.status(500).json("Something went wrong...")
  }
}