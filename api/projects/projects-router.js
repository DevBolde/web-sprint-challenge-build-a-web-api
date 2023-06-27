// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')
const router = express.Router()

const {errorHandling} = require('./projects-middleware')


router.get('/api/projects', errorHandling, (req, res, next) => {
    Project.get()
      .then(proj => {
        res.json(proj)
      })
      .catch(error => {
        // log error to server
        next(error);
      });
});

router.get('/api/projects/:id', errorHandling, async (req, res, next) => {
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
  
router.post('/api/projects', errorHandling,  async (req, res, next) => {
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
router.put('/api/projects/:id', errorHandling, async (req, res, next) => {
  try{
    const {id} = req.params;
    const {name, description, completed} = req.body;
    
    if (!name && !description && !completed) {
      return res.status(400).json({
        message: `project with ${id} ID does not exist!`,
      });
    }else{
        const updateProject = await Project.update(id, {name, description, completed})
      .then(proj => {
        if(!proj){
          res.status(404).json({
            message: 'the project could not be found'
          })
        }else{
          console.log(proj)
           res.status(200).json(proj)
        }
      })
      .catch(error => {
        next(error);
      })
    }
  }catch(error){
    next(error)
  }
 
})
  module.exports = router;