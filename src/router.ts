import * as express from "express";
const router = express.Router();

// Routers
import User from "./modules/user/user.router";

// Routes
router.use('/user', User);


export default router;
