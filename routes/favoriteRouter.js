const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favorite = require ('../models/favorite');
const bodyParser = require('body-parser');
const user = require('../models/user');
const Campsite = require('../models/campsite');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    favorite.find()
    .populate(user, Campsite)
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    favorite.create(req.params._id)
    .then(favorite => {
        if(favorite){
          
        }
        console.log('favorite Created ', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    favorite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(403))
.get(cors.cors, (req, res ) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
})


.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    favorite.create(req.body)
    .then(favorite => {
        console.log('favorite Created ', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions,  authenticate.verifyUser,authenticate.verifyAdmin,(req, res,) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    favorite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;
