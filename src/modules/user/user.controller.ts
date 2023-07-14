import { User, decodeJWT } from "./user.model";
import * as bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
const Config = require("config");

// login API starts //

export const login = async (req, res) => {
  try {
    req.body.Email = req.body.Email ? req.body.Email : "";
    req.body.Password = req.body.Password ? req.body.Password : "";
    const user: any = await User.findOne({
      attributes: ["ID", "Email", "Name", "Password", "Role"],
      where: {
        Email: req.body.Email,
      },
    });
    if (!user) {
      throw new Error("We are unaware of this user");
    }
    if ((await user.validatePassword(req.body.Password.toString())) !== true) {
      throw new Error("Incorrect Login Credentials");
    }
    return res.status(200).json({
      message: "Welcome back" + " " + user.Name,
      token: user.generateJWTToken(),
      data: {
        ID: user.ID,
        Email: user.Email,
        Name: user.Name,
        Role: user.Role,
      },
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// Login API ends //

//  Save API starts //

export const save = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    if (!req.body.Email) {
      throw new Error("Invalid Request. Please make sure email is provided");
    }
    req.body.Email = req.body.Email.toLowerCase();
    req.body.Name = req.body.Name ? req.body.Name : "";
    req.body.Email = req.body.Email ? req.body.Email : "";
    req.body.Password = req.body.Password ? req.body.Password : "";
    req.body.Role = req.body.Role ? req.body.Role : "";
    let existingEmails: any = [];
    let ID = req.body.ID ? req.body.ID : null;
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(req.body.Email))
      throw new Error("Please provide a valid Email");

    existingEmails = await User.findOne({
      attributes: ["ID", "Email"],
      where: {
        Email: req.body.Email,
      },
    });
    if (existingEmails) {
      if (existingEmails.dataValues.ID != req.body.ID) {
        throw new Error(`Email  Already Exists`);
      }
    }
    if (req.body.Password != null) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.Password, salt);
      req.body.Password = hash;
    }
    if (payload.Role == "Basic") {
      throw new Error("Basic user has no permssion to create other users");
    }
    if (
      (payload.Role == "Admin" && req.body.Role == "Admin") || req.body.Role == "SuperAdmin") {
      throw new Error(
        "Admin user has no permssion to create other Admin users or Super Admin"
      );
    }
    const user = await User.findOne({
      attributes: ["ID", "Email"],
      where: {
        ID: ID,
      },
    });
    if (!user) {
      await User.create(req.body);
      return res.status(200).json({
        message: "User Saved Successfully",
        success: true,
      });
    } else {
      if (req.body.ID && req.body.Email != user.dataValues.Email) {
        // req.body.FCMToken = "";
      }
      await User.upsert(req.body);
      return res.status(200).json({
        message: "User Saved Successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(200).json({
      message: error.message,
      success: false,
    });
  }
};
// Save API ends //

// Delete API starts //
export const deleteUser = async (req, res) => {
    try {
      const payload: any = decodeJWT(req.headers.authorization);
      let ID = req.query.ID ? req.query.ID : null;
      if(!ID) {
        throw new Error ("Please Provide the UserID")
      } 
      const user = await User.findOne({
        where:{
            ID:ID
        }
      })
      console.log(payload.Role);
      if (payload.Role == "Basic") {
        throw new Error("Basic user has no permssion to delete other users");
      }
      if (payload.Role == "Admin" && (user.dataValues.Role == "SuperAdmin" || user.dataValues.Role == "Admin")) {
        throw new Error("Admin user has no permission to delete other Admin users or Super Admin");
      }      
      if(!user) {
        throw new Error("User Not Found")
      } else {
        await User.destroy({
            where:{
                ID:ID
            }
        })
      }
      return res.status(200).json({
        message: "User Deleted Successfully",
        success: true,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };