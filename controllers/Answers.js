import Questions from "../models/Questions.js"
import mongoose from "mongoose";

export const postAnswer = async (req,res) => {
  const {id: _id} = req.params;
  const { noOfAnswers, answerBody, userAnswered, userId } = req.body;

  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  updateNoOfQuestions(_id,noOfAnswers)
  try {
    const updatedQuestion = await Questions.findByIdAndUpdate(_id,{
      $addToSet: {'answer': [{answerBody, userAnswered, userId}]}
    })
    res.status(200).json(updatedQuestion)
  } catch (error) {
    res.status(400).json(error)
  }
}


export const postCommentQues = async (req,res) => {
  const {id: _id} = req.params;
  const {commentBody,userCommented,userId} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  try {
    const postComment = await Questions.findByIdAndUpdate(_id,{
      $addToSet: {'comment': [{commentBody,userCommented,userId}]}
    })
    res.status(200).json(postComment)
  } catch (error) {
    res.status(400).json(error)
  }

}

export const deleteCommentQues = async (req,res) => {
  const {id:_id} = req.params;
  const {commentId} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(404).send('Comment unavailable')
  }
  try {
    await Questions.updateOne(
      {_id},
      {$pull: {'comment':{_id:commentId}}}
    )
    res.status(200).json({message:"Successfully deleted..."})
  } catch (error) {
    res.status(405).json(error)
    console.log(error);
  }
}

export const editCommentQues = async (req,res) => {
  const {id:_id} = req.params;
  const {commentId,commentBody} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(404).send('Comment unavailable')
  }
  try {
    const updatedComment = await Questions.updateOne(
      {_id: _id, "comment._id":commentId},
      {
        $set: {
          "comment.$.commentBody":commentBody
        }
      },
      {
        new: true
      }
    )
    res.status(200).json(updatedComment)
  } catch (error) {
    res.status(405).json(error)
    console.log(error);
  }
}

export const postCommentAns = async (req,res) => {
  const {id:_id} = req.params;
  const {answerId,commentBody,userCommented,userId} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(answerId)){
    return res.status(404).send('Answer unavailable')
  }
  try {
    const postAnsComment = await Questions.updateOne(
      {_id:_id,'answer._id':answerId},
      {
        $addToSet: { 'answer.$.comment': [{commentBody,userCommented,userId}] }
      })
      res.status(200).json(postAnsComment);
  } catch (error) {
    res.status(400).json(error)
  }
}

export const deleteAnsComment = async (req,res) => {
  const {id:_id} = req.params;
  const {answerId,commentId} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(answerId)){
    return res.status(404).send('Answer unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(404).send('Comment unavailable')
  }
  try {
    await Questions.updateOne(
      {_id,'answer._id':answerId},
      {$pull: {'answer.$.comment':{_id:commentId}}}
    )
    res.status(200).json({message:"Successfully deleted..."})
  } catch (error) {
    res.status(405).json(error)
    console.log(error);
  }
}

export const editAnsComment = async (req,res) => {
  const {id:_id} = req.params;
  const {answerId,commentId,commentBody} = req.body;
  console.log({answerId,commentId,commentBody});
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(answerId)){
    return res.status(404).send('Answer unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(commentId)){
    return res.status(404).send('Comment unavailable')
  }
  try {
    const updatedComment = await Questions.updateOne(
      {_id:_id,'answer._id':answerId},
      {
        $set: {'answer.$.comment.$[elem].commentBody':commentBody}
      },
      {arrayFilters: [{"elem._id" : {$eq : commentId}}]}
    )
    res.status(200).json(updatedComment)
  } catch (error) {
    res.status(400).json(error)
    console.log(error);
  }
}

const updateNoOfQuestions = async (_id,noOfAnswers) => {
  try {
    await Questions.findByIdAndUpdate(_id,{
      $set: {'noOfAnswers':noOfAnswers}
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteAnswer = async (req,res) => {
  const {id:_id} = req.params;
  const {answerId,noOfAnswers} = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send('Question unavailable')
  }
  if(!mongoose.Types.ObjectId.isValid(answerId)){
    return res.status(404).send('Answer unavailable')
  }
  updateNoOfQuestions(_id,noOfAnswers)
  try {
    await Questions.updateOne(
      {_id},
      {$pull: {'answer':{_id:answerId}}}
    )
    res.status(200).json({message:"Successfully deleted..."})
  } catch (error) {
    res.status(405).json(error)
    console.log(error);
  }
}

// export const getComments = async (req,res) => {
//   try{
//     const comments = await Comment.find();
//     res.status(200).json(comments);
//   }catch(error){
//     res.status(404).json({message:error.message});
//     console.log(error)
//   }
// }

// export const deleteComment = async (req,res) => {
//   const {id:commentId} = req.params;
//   if(!mongoose.Types.ObjectId.isValid(commentId)){
//     return res.status(404).send('Comment unavailable')
//   }
//   try {
//     await Comment.findByIdAndDelete(commentId)
//     res.status(200).json({message:"Successfully deleted..."})
//   } catch (error) {
//     res.status(405).json(error)
//     console.log(error);
//   }
// }

// export const updateComment = async (req,res) => {
//   const {id:commentId} = req.params;
//   const {commentBody} = req.body;
//   if(!mongoose.Types.ObjectId.isValid(commentId)){
//     return res.status(404).send('Comment unavailable')
// }
//   try {
//       const updatedComment = await Comment.findByIdAndUpdate(commentId,
//         {
//           $set: {
//             'commentBody' : commentBody
//           }
//         },
//         {
//           new: true
//         }
//         )
//       res.status(200).json(updatedComment);
//   } catch (error) {
//       res.status(405).json({message: error.message});
//   }
// }