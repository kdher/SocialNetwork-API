const { User } = require('../models');


module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    
    //Get User by Id with thoughts
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
           .populate({
               path: 'thoughts',
               select: '-__v'
            })
            .populate ({
                path: 'friends',
                select: '-__v'
            })
           .select('-__v')
           .then(dbUserData => res.json(dbUserData))
           .catch(err => {
               console.log(err)
               return res.status(500).json(err)
        });
     },

     // Create a New User
     createUser(req, res) {
        console.log('You are create a User');
         User.create(req.body)
         .then(dbUserData => res.json(dbUserData))
         .catch(err => res.status(400).json(err));
     },

     // Add friend
     addFriend({ params }, res) {
        console.log('You are adding a friend');
         User.findOneAndUpdate(
             {_id: params.userId},
             { $addToSet: { friends: params.friendId } },
             { runValidators: true, new: true }
         )
         .then((dbUserData) => {
             !dbUserData
                ? res
                      .status(404).
                      json({ message: 'No user found with this ID!' })
                : res.json(dbUserData)
          })
         .catch((err) => res.json(err));
     },

     // Update User
     updateUser({ params, body}, res) {
         User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
         .then((dbUserData) => 
             !dbUserData
                 ? res.status(404).json({ message: 'No user found with this ID!' })
                 : res.json(dbUserData)
         )
            .catch((err) => res.json(err));
     },

     // Delete User
     deleteUser({params}, res) {
         User.findOneAndDelete({ _id: params.id })
         .then((dbUserData) => 
            !dbUserData 
             ? res.status(404).json({ message: 'No user found with this ID!' })
             : res.json(dbUserData)
         )
         .catch((err) => res.status(400).json(err)
         )
     },

     // Remove Friend
     removeFriend( { params }, res) {
         User.findOneAndUpdate(
             { _id: params.userId },
             { $pull: { friends: params.friendId }},
             { runValidators: true, new: true }
         )
         .then((dbUserData) => 
          !dbUserData 
          ? res
              .status(404)
              .json({message: 'No user found with that ID'})
          :res.json(dbUserData))
          .catch((err) => res.status(500).json)
         
     },
     
};
   