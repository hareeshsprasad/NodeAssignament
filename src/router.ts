import * as express from "express";
const router = express.Router();

// Routers
import User from "./modules/user/user.router";
import Feed from "./modules/feed/feed.router";

// Routes
router.use('/user', User);
router.use('/feed', Feed);


export default router;
