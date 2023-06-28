// add middlewares here related to actions



async function checkActionUpdatePayload (req, res, next){
    if(req.body.notes && req.body.description && req.body.project_id && req.body.project_id !== undefined){
      next()
    }else{
      next({
        status: 400,
        message: "Please provide name, description and completed status"
      })
    }
  }

  module.exports ={
    checkActionUpdatePayload
  }