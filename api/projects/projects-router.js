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
  
  router

  module.exports = router;