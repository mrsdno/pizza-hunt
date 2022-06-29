const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go here as methods

    // get all pizzas

    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                // tell mongoose we dont care about the v field (- tells it to exclude)
                select: '-__v'
            })
            .select('-__v')
            // sort in descending order by id 
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //get one pizza by id
    // destructure the params out of the req 
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
          .populate({
            path: "comments",
            select: "-__v",
          })
          .select("-__v")
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

    // create pizza 
    // destructure the body out of the express.js req because we do not need to interface with any other data it provides 
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },
    // update pizza
    updatePizza({ params, body }, res) {
        // if you do not set new: true, it will return the original document
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;