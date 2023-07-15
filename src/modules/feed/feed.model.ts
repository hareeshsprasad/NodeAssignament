import * as Sequelize from "sequelize";
import sequelize from "../../orm";
import { User } from "../user/user.model";

export const Feed = sequelize.define(
  "Feed",
  {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    Name: Sequelize.STRING,
    Url: Sequelize.STRING,
    Description: Sequelize.STRING,
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export const UserFeedAccess = sequelize.define(
  "UserFeedAccess",
  {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    UserID: Sequelize.STRING,
    FeedID: Sequelize.STRING,
    AccessLevel: Sequelize.ENUM("0", "1", "2"),
    DeletePermission: Sequelize.ENUM('0','1')
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

UserFeedAccess.belongsTo(Feed, { foreignKey: "FeedID", targetKey: "ID" });
Feed.hasMany(UserFeedAccess, { foreignKey: "FeedID", sourceKey: "ID" });
UserFeedAccess.belongsTo(User, { foreignKey: "UserID", targetKey: "ID" });
