const { Schema, model } = require('mongoose');

//Create User collection
const UserSchema = new Schema(
  {
    username:{
        type: String,
        required: true,
        unique:true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique:true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'is not a valid email address!'] 
    },
    thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought',
        }
    ],
    friends: [
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        }
    ]
},
{
    toJSON: {
      virtuals: true
    },
    id: false,
  }  
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema);

// export the User model
module.exports = User;