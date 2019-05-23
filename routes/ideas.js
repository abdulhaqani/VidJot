const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea');

const Idea = mongoose.model('ideas');

// Idea index page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

// Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then(idea => {
    // eslint-disable-next-line eqeqeq
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'not authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea,
      });
    }
  });
});

// process form
router.post('/', ensureAuthenticated, (req, res) => {
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
      user: req.user.id,
    };
    new Idea(newUser).save().then(() => {
      req.flash('success_msg', 'video idea added');
      res.redirect('/');
    });
  }
});

// edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'video idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
