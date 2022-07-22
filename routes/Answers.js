import express from 'express';
import {postAnswer,deleteAnswer,postCommentQues, deleteCommentQues,editCommentQues,postCommentAns,deleteAnsComment,editAnsComment} from "../controllers/Answers.js";
import auth from '../middlewares/auth.js';
const router = express.Router();

router.patch('/post/:id',auth,postAnswer)
router.patch('/delete/:id',auth,deleteAnswer)
// router.post('/comment',auth,postComment)
// router.get('/getComment',auth,getComments)
// router.delete('/deleteComment/:id',deleteComment)
// router.patch('/updateComment/:id',auth,updateComment);

router.patch('/comment/:id',postCommentQues);
router.patch('/deleteComm/:id',deleteCommentQues);
router.patch('/editComment/:id',editCommentQues);

router.patch('/postAnsComment/:id',postCommentAns);
router.patch('/deleteAnsComment/:id',deleteAnsComment);
router.patch('/editAnsComment/:id',editAnsComment)

export default router;