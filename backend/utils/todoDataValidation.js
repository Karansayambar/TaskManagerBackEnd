const todoDataValidation = ({ task }) => {
    return new Promise((resolve, reject) => {
      if (!task) reject("Missing todo data");
      if (task.length < 3 || task.length > 100)
        reject("Length of todo should be in 3 to 100 characters");
      if (typeof task !== "string") reject("todo not in text");
      resolve();
    });
  };
  
  module.exports = { todoDataValidation };
  