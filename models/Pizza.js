// only import Schema constructor and model function
const { Schema, model } = require('mongoose');


// create the schema for the model
const PizzaSchema = new Schema({

    // The name of the pizza
    pizzaName: {
        type: String
    },

    // The name of the user that created the pizza
    createdBy: {
        type: String
    },

    // A timestamp of when the pizza was created
    createdAt: {
        type: Date,
        default: Date.now
    },

    // A timestamp of any updates to the pizza's data


    // The pizza's suggested size
    size: {
        type: String,
        default: 'Large'
    },

    // The pizza's toppings with array as data type
    toppings: []
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;