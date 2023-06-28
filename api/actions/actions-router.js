// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model')
const router = express.Router()

const {checkActionUpdatePayload} = require('./actions-middlware')



router.get('/api/actions', (req, res, next) => {
    Action.get()
      .then(actions => {
        res.json(actions);
      })
      .catch(error => {
        next(error);
      });
  });
router.get('/api/actions/:id', (req, res, next) => {
    const { id } = req.params;
  
    Action.get(id)
      .then(action => {
        if (action) {
          res.json(action);
        } else {
          res.status(404).json({ message: 'Action not found' });
        }
      })
      .catch(error => {
        next(error);
      });
  });
router.post('/api/actions',  async (req, res, next) => {
    try {
      
      const action = req.body; 

      if(!action.notes || !action.description || !action.project_id){
       return  res.status(400).json({
          message: "Error: you need name AND description"
        })
      }

      const insertedAction = await Action.insert(action)
        
         res.status(201).json(insertedAction);

    } catch (error) {
      next(error)
    }
  });
router.put('/api/actions/:id', checkActionUpdatePayload, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes, description, completed, project_id } = req.body;
    
        if (!notes && !description && !completed && !project_id) {
          return res.status(400).json({
            message: 'Missing required fields: notes, description, project_id, or completed',
          });
        } else {
          const updatedAction = await Action.update(id, { notes, description, completed, project_id });
    
          if (!id) {
            return res.status(404).json({
              message: 'The project could not be found',
            });
          }
    
          res.status(200).json(updatedAction);
        }
      } catch (error) {
        next(error);
      }
 })
router.delete('/api/actions/:id', (req, res, next) => {
    const {id} = req.params;
    Action.remove(id)
    .then(act => {
      if(!act){
        res.status(404).json({
          message: "Project could not be found!"
        })
      }else{
        res.json({
          message: "Project deleted successfully!"
        })
      }
    })
      .catch(err => {
            next(err);

      })
})
  module.exports = router;