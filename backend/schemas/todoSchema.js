const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    task : {
        type : String,
        required : true,
        minLength: 3,
        maxlength: 100,
        trim: true,
    },
    isCompleted:{
        type: Boolean,
        default:false
    },
    isImportant : {
        type : Boolean,
    },
    dueDate : {
        type : Date,
        default : Date.now(),
    },
    priority : {
        type :String,
        enum : ['High','Medium', 'Low'],
        required : true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
}, {
    timestamps : true
}
)

module.exports = mongoose.model("Todo", todoSchema);