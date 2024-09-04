const todoSchema = require("../schemas/todoSchema");
const { findOneAndUpdate } = require("../schemas/userSchema");
const ObjectId = require("mongodb").ObjectId;


const createTodo = ({task, isImportant, priority, dueDate, userId}) => {
    return new Promise((resolve, reject) => {
    let todoObj
     if(dueDate === null){
         todoObj = new todoSchema({
            task,
            isImportant,
            priority,
            userId
        });
     }
     else {
         todoObj = new todoSchema({
            task,
            isImportant,
            priority,
            dueDate,
            userId
        });
     }
    try {
        const todoDb = todoObj.save();
        resolve(todoDb);
    } catch (error) {
        reject(error);
    }
    })
}

const getTodoById = ( {todoId} ) => {
    return new Promise(async (resolve, reject) => {
      if (!todoId) reject("Missing Blog");
      if (!ObjectId.isValid(todoId)) reject("Incorrect TaskId");
      try {
        const todoDB = await todoSchema.findOne({ _id: todoId });
        if (!todoDB) reject(`Todo Not Found with this ID${todoId}`);
        return resolve(todoDB);
      } catch (error) {
        return reject(error);
      }
    });
  };


  const changeCompletedStatus = ( {todoId} ) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateTodo = await todoSchema.findOneAndUpdate({_id:todoId},{
                isCompleted: true,
            })
            return resolve(updateTodo);
        } catch (error) {
          reject(error);
        }
    })
  };

const editTodoWithId = ({task, isImportant, priority, dueDate, todoId}) => {
    return new Promise(async(resolve, reject) => {
        try {
            const todoDb = await todoSchema.findOneAndUpdate(
              { _id: todoId },
              { task : task, isImportant : isImportant, priority : priority, dueDate : dueDate }
            );
            resolve(todoDb);
          } catch (error) {
            reject(error);
          }
    })
}

const readTask = ({ userId }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const todoDb = await todoSchema.aggregate([
                {
                    $match: { userId: userId },
                },
                {
                    $addFields: {
                        priorityOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$priority", "High"] }, then: 1 },
                                    { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                                    { case: { $eq: ["$priority", "Low"] }, then: 3 },
                                ],
                                default: 4,
                            }
                        },
                        // Create a new field to ensure completed tasks are last
                        sortOrder: {
                            $cond: { if: { $eq: ["$isCompleted", true] }, then: 1, else: 0 }
                        }
                    }
                },
                {
                    $sort: {
                        sortOrder: 1,       // Ensure completed tasks are last
                        dueDate: 1,         // Sort by dueDate in ascending order
                        priorityOrder: 1    // Sort by priorityOrder
                    }
                },
                {
                    $project: {
                        priorityOrder: 0,  // Remove the temporary field from the output
                        sortOrder: 0       // Remove the temporary field from the output
                    },
                },
            ]);
           return resolve(todoDb);
        } catch (error) {
            reject(error);
        }
    });
}

const changePriorityStatus = ({todoId, status}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateTodo = await todoSchema.findOneAndUpdate({_id : todoId},{
                priority : status ? "High" : "Low",
                isImportant : status
            })
            return resolve(updateTodo);
        } catch (error) {
            return reject(error);
        }
    })
}

const deleteTaskWithId = ({todoId}) => {
    return new Promise(async(resolve, reject) => {
        try {
            const todoDb = await todoSchema.findOneAndDelete({_id : todoId});
            resolve(todoDb);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {createTodo, editTodoWithId, getTodoById, changeCompletedStatus, readTask, deleteTaskWithId, changePriorityStatus};