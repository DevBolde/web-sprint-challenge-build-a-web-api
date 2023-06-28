// add middlewares here related to projects
const Project = require('./projects-model')

function errorHandling(err, req, res, next) { // eslint-disable-line
  res.status(err.status || 500).json({
    message: `Horror in the router: ${err.message}`,
    stack: err.stack,
  });
}

async function checkProjectUpdatePayload (req, res, next){
  if(req.body.name && req.body.description && req.body.completed !== undefined){
    next()
  }else{
    next({
      status: 400,
      message: "Please provide name, description and completed status"
    })
  }
}

  module.exports = {
    errorHandling,
    checkProjectUpdatePayload
  }