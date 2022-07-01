// only import Schema constructor and model function
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// create the schema for the model
const PizzaSchema = new Schema(
  {
    // The name of the pizza
    pizzaName: {
      type: String,
      required: 'You need to provide a pizza name!',
      trim: true
    },

    // The name of the user that created the pizza
    createdBy: {
      type: String,
    },

    // A timestamp of when the pizza was created
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },

    // A timestamp of any updates to the pizza's data

    // The pizza's suggested size
    size: {
      type: String,
      default: "Large",
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large']
    },

    // The pizza's toppings with array as data type
    toppings: [],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);


// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0
  );
});

// export the Pizza model
module.exports = Pizza;
