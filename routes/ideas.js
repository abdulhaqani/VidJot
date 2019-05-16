const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

require('../models/Idea');

const Idea = mongoose.model('ideas');

// Idea index page
router.get('/', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

// Add idea form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then(idea => {
    res.render('ideas/edit', {
      idea,
    });
  });
});

// process form
router.post('/', (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: 'please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'please add a details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Idea(newUser).save().then(() => {
      req.flash('success_msg', 'video idea added');
      res.redirect('/');
    });
  }
});

// edit form process
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(() => {
      req.flash('success_msg', 'video idea updated');
      res.redirect('/');
    });
  });
});

// Delete idea
router.delete('/:id', (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'video idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
