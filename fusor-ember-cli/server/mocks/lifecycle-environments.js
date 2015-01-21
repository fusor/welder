module.exports = function(app) {
  var express = require('express');
  var lifecycleEnvironmentsRouter = express.Router();

  lifecycleEnvironmentsRouter.get('/', function(req, res) {
    res.send({
      'lifecycle-environments': []
    });
  });

  lifecycleEnvironmentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  lifecycleEnvironmentsRouter.get('/:id', function(req, res) {
    res.send({
      'lifecycle-environments': {
        id: req.params.id
      }
    });
  });

  lifecycleEnvironmentsRouter.put('/:id', function(req, res) {
    res.send({
      'lifecycle-environments': {
        id: req.params.id
      }
    });
  });

  lifecycleEnvironmentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/lifecycle-environments', lifecycleEnvironmentsRouter);
};
