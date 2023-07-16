import * as express from "express";
const router = express.Router();
// Middlewares
import { isAuthenticated } from './../../middleware';
import { save,deleteFeed,list,feedAccess} from './feed.controller'

// Routes
router.post('/save',isAuthenticated,save)
router.delete('/delete',isAuthenticated,deleteFeed)
router.get('/list',isAuthenticated,list)
router.post('/feedAccess',isAuthenticated,feedAccess)

export default router;