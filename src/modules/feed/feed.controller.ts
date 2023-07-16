import { Model } from "sequelize";
import { User, decodeJWT } from "../user/user.model";
import { Feed, UserFeedAccess } from "./feed.model";

const Config = require("config");

//  Save API starts //

export const save = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    let ID = req.body.ID ? req.body.ID : null;
    req.body.Name = req.body.Name ? req.body.Name : "";
    req.body.Url = req.body.Url ? req.body.Url : "";
    req.body.Description = req.body.Description ? req.body.Description : "";
    req.body.Role = req.body.Role ? req.body.Role : "";
    if (payload.Role == "Basic" || payload.Role == "Admin") {
      throw new Error("You have no permssion to create feeds");
    }
    const feed = await Feed.findOne({
      attributes: ["ID"],
      where: {
        ID: ID,
      },
    });
    if (!feed) {
      await Feed.create(req.body);
      return res.status(200).json({
        message: "Feed Saved Successfully",
        success: true,
      });
    } else {
      await Feed.upsert(req.body);
      return res.status(200).json({
        message: "Feed Saved Successfully",
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
export const deleteFeed = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    let ID = req.query.ID ? req.query.ID : null;
    if (!ID) {
      throw new Error("Please Provide the UserID");
    }
    const feed:any = await Feed.findOne({
      where: {
        ID: ID,
      },
    });
    if (payload.Role == "Basic") {
      throw new Error("You have no permssion to delete the feed");
    }
    if(payload.Role ="Admin" && feed.DeletePermisson == "0") {
        throw new Error("You have no permssion to delete the feed");
    }
    if (!feed) {
      throw new Error("Feed Not Found");
    } else {
      await Feed.destroy({
        where: {
          ID: ID,
        },
      });
    }
    return res.status(200).json({
      message: "Feed Deleted Successfully",
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete API Ends //

// List ap starts //

export const list = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    let accessLevel;
    let feed;
    if (payload.Role == "Basic" || payload.Role == "Admin") {
      if (payload.Role == "Basic") {
        accessLevel = "1";
      }
      if (payload.Role == "Admin") {
        accessLevel = "2";
      }
      feed = await Feed.findAll({
        include: {
          model: UserFeedAccess,
          attributes: ["ID", "UserID", "FeedID", "AccessLevel"],
          where: {
            UserID: payload.ID,
            AccessLevel:accessLevel
          },
        },
      });
      return res.status(200).json({
        message: "Feed Listed Successfully",
        data: feed,
        success: true,
      });
    } else {
        feed = await Feed.findAll({})
    }
    return res.status(200).json({
      message: "Feed Listed Successfully",
      data: feed,
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

//  Feed Access API starts //

export const feedAccess = async (req, res) => {
  try {
    const payload: any = decodeJWT(req.headers.authorization);
    if (payload.Role == "Basic") {
      throw new Error("Only Admins can access this route");
    }
    let ID = req.body.ID ? req.body.ID : null;
    let UserID = req.body.UserID ? req.body.UserID : null;
    let FeedID = req.body.FeedID ? req.body.FeedID : null;
    let AccessLevel = req.body.AccessLevel ? req.body.AccessLevel : null;
    let DeletePermisson = req.body.DeletePermisson ? req.body.DeletePermisson : null;
    if (payload.Role == "Admin") {
        let checkPermission:any = await UserFeedAccess.findOne({
            where:{
                UserID : payload.ID,
                FeedID : FeedID
            }
        })
        if(checkPermission.AccessValue !='1') {
            throw new Error("You have not permited to give access to this feed");
        }
    }
    if (!UserID) {
      throw new Error("Please Enter the USer");
    }
    if (!FeedID) {
      throw new Error("Please Enter the Feed");
    }
    const access = await UserFeedAccess.findOne({
      where: {
        ID: ID,
      },
    });
    if (!access) {
      await UserFeedAccess.create(req.body);
      return res.status(200).json({
        message: "Access Provided Successfully",
        success: true,
      });
    } else {
      await UserFeedAccess.upsert(req.body);
      return res.status(200).json({
        message: "Access Updated Successfully",
        success: true,
      });
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// Feed Access API ends //
