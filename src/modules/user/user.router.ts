import * as express from "express";
const router = express.Router();
// Middlewares
import { isAuthenticated } from './../../middleware';
import { save,login,deleteUser} from './user.controller'

// Routes
router.post('/save',save)
router.post('/login',  login)
router.delete('/deleteUser', isAuthenticated, deleteUser)
export default router;