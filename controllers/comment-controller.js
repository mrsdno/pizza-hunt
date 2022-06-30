const { Comment, Pizza } = require("../models");

const commentController = {
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        // find the pizza with this id and push this comment to the array, then return it as a promise
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    ).then((dbPizzaData) => {
      if (!dbPizzaData) {
        res.status(404).json({ message: "No pizza found with this id!" });
        return;
      }
      res.json(dbPizzaData);
    })
      .catch(err => res.json(err));
  },

  removeComment({ params }, res) {
    // first delete the comment
    Comment.findOneAndDelete({ _id: params.commentId })

      // then use its _id to remove it from the pizza
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      //Here, we're using the MongoDB $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  }
};

module.exports = commentController;
