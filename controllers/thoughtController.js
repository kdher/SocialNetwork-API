const { Thought, User } = require("../models");

module.exports = {
    //Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch((err) => res.status(500).json(err));
    },


    //Get thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => 
        
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought found with this id!' })
          : res.json(dbThoughtData)
    )
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

    //create thought
    createThought({ body }, res) {
         console.log(body);
        Thought.create(body)
            .then(({ _id}) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => 
                 !dbThoughtData
                    ? res.status(404).json({ message: 'No user found with this id!' })
                    : res.json(dbThoughtData)
              )
              .catch(err => res.json(err));
    },

    //add reaction
    addReaction (req, res) {
        console.log('You are adding a Reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        )
        .then((dbThoughtData) => 
            !dbThoughtData
                ? res.status(404).json({ message: 'No thought with this ID!' })
                : res.json(dbThoughtData)
         )
        .catch((err) => res.status(500).json(err));
    },

    //Remove Reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
      //delete a thought  
      deleteThought({ params, body}, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((deletedThought) => 
            !deletedThought 
            ? res.status(404).json({ message: 'No Thought with that ID' })
            : User.deleteMany({ _id: { $in: Thought.users } })
        )
        .then(() => res.json({ message: 'thoughts and users deleted!' }))
        .catch((err) => res.json(err));
    },

    //Update a thought by Id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, { $set: req.body}, { runValidators: true, new: true })
        .then((updatedThought) => {
            !updatedThought
                ? res.status(404).json({ message: 'No thought with this ID!' })
                : res.json(updatedThought)
        })
        .catch((err) => res.json(err));
    }, 
};