const { Complain, User, Comment } = require("../Schemas/schema");

function errorMessage(message = "", status = 500) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}
const newComment = async (req, res, next) => {
  const { comment, complainId } = req.body;
  const { id } = req.user;
  if (!comment) {
    return next(errorMessage("the comment can not be empty", 400));
  } else if ((!complainId, !id)) {
    return next(errorMessage());
  }
  const commentCreation = await Comment.create({
    complainId,
    commentedBy: id,
    comment,
  });
  await Complain.findByIdAndUpdate(complainId, {
    $push: { comments: commentCreation._id },
  });

  await User.findByIdAndUpdate(id, {
    $push: { comments: commentCreation._id },
  });
  res.status(201).json({ message: "created" });
};

module.exports = { newComment };
