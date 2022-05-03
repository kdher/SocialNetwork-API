const { Schema, model,Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Create reaction subdocument schema
const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      trim: true,
      minlength:1,
      maxlength:280
    },
    username: {
       type: String,
       required: true,
       trim: true
    },
    createdAt:{
       type: Date,
       default: Date.now,
       get: (createdAtVal) => dateFormat(createdAtVal)
    }
},
{
    toJSON: {
      getters: true
    }
} 
);


//Create Thought collection
const ThoughtSchema = new Schema(
  {
    thoughtText:{
        type: String,
        required: true,
        minlength:1,
        maxlength:280
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username:{
        type: String,
        required: true,
        trim: true
    },
    reactions:[ReactionSchema]
},
{
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }  
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});


const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;