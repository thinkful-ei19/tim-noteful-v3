'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();
const mongoose = require('mongoose');

const Note = require('../models/note');

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {

  const { searchTerm } = req.query;
  let filter = {};


  let projection = {};
  let sort = 'created'; // default sorting

  if (searchTerm) {
    filter.$text = { $search: searchTerm };
    projection.score = { $meta: 'textScore' };
    sort = projection;
  }

  Note.find(filter, projection)
    .sort(sort)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });


  // console.log('Get All Notes');
  // res.json([
  //   { id: 1, title: 'Temp 1' }, 
  //   { id: 2, title: 'Temp 2' }, 
  //   { id: 3, title: 'Temp 3' }
  // ]);

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  const { id } = req.params;

  //handle error
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .then(results => {
      if (results) {
        res.json(results);
      }
      else {
        next();
      }
    })
    .catch(next);
  // console.log('Get a Note');
  // res.json({ id: 2 });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  /***** Never trust users - validate input *****/

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  let newItem = { title, content };

  Note.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(next);


  // console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2 });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {

  const { id } = req.params;
  const { title, content } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateItem = { title, content };
  const options = { new: true };

  Note.findByIdAndUpdate(id, updateItem, options)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});




module.exports = router;