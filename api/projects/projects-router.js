// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')
const router = express.Router()

const { errorHandling, checkProjectUpdatePayload } = require('./projects-middleware')


router.get('/api/projects',  (req, res, next) => {
    Project.get()
      .then(proj => {
        res.json(proj)
      })
      .catch(error => {
        // log error to server
        next(error);
      });
});

router.get('/api/projects/:id',  async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(404).json({
          message: `Project ID is missing or invalid`,
        });
      }
  
      Project.get(id)
        .then(proj => {
          if (!proj) {
            return res.status(404).json({
              message: `Project with ID ${id} cannot be found`,
            });
          }
  
          res.json(proj);
        })
        .catch(error => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  });
  
router.post('/api/projects',  async (req, res, next) => {
    try {
      
      const project = req.body; // Assuming the project data is passed in the request body
  
      // Insert the project into the database
      if(!project.name || !project.description){
       return  res.status(400).json({
          message: "Error: you need name AND description"
        })
      }
      const insertedProject = await Project.insert(project);

         res.status(201).json(insertedProject);

    } catch (error) {
      next(error)
    }
  });

  router.put('/api/projects/:id', checkProjectUpdatePayload, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, completed } = req.body;
  
      if (!name && !description && !completed) {
        return res.status(400).json({
          message: 'Missing required fields: name, description, or completed',
        });
      } else {
        const updatedProject = await Project.update(id, { name, description, completed });
  
        if (!id) {
          return res.status(404).json({
            message: 'The project could not be found',
          });
        }
  
        res.status(200).json(updatedProject);
      }
    } catch (error) {
      next(error);
    }
  });
  
router.delete('/api/projects/:id', (req, res, next) => {
  
    const {id} = req.params;
    Project.remove(id)
    .then(proj => {
      if(!proj){
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
  
router.get('/api/projects/:id/actions', async (req, res, next) => {
  try{
  const {id} = req.params;
    if(!id){
      res.status(404).json({
        message: `project with id:${id} doesnt exist!`
      })
    }else{
        const projectAction = await Project.getProjectActions(id)
          res.json(projectAction)
    }
    
  }catch(err){
    next(err);
  }
  
})


  module.exports = router;