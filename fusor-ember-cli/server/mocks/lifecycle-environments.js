module.exports = function(app) {
  var express = require('express');
  var lifecycleEnvironmentsRouter = express.Router();

  var lifecycleEnvironments = [
       {
          id: 1,
          name: 'Library',
       },       {
          id: 2,
          name: 'Development',
       },
       {
          id: 3,
          name: 'Test',
       },
       {
          id: 4,
          name: 'Production',
       }
  ];


  lifecycleEnvironmentsRouter.get('/', function(req, res) {
    res.send({
      'results': lifecycleEnvironments
    });
  });

  lifecycleEnvironmentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  lifecycleEnvironmentsRouter.get('/:id', function(req, res) {
    res.send({
        id: req.params.id
    });
  });

  lifecycleEnvironmentsRouter.put('/:id', function(req, res) {
    res.send({
      'lifecycle_environment': {
        id: req.params.id
      }
    });
  });

  lifecycleEnvironmentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/v2/lifecycle_environments', lifecycleEnvironmentsRouter);
};
