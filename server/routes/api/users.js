/*
  This is the main router file.
*/

// Get express router 
const router = require('express').Router();

// Projects model from the model folder
const Users = require('../../models/User');

// @route   GET api/projects
// @desc    Get All Items
// @access  Public
// Will grab user on login
router.get('/login', (req, res) =>{
    Users.find({
          username: req.body.username
        })
        .then(user => res.json(username))
});

// @route   POST /register
// @desc    Create A User
// @access  Public
// Will create new users using the requests body name 
router.post('/register', (req, res) =>{
    const newUser = new Users({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save().then(user => res.json(user));
});

/*
// @route   DELETE api/projects
// @desc    DELETE A Post
// @access  Public
// Will delete projects with a certain id
router.delete('/:id', (req, res) =>{
  Projects.findById(req.params.id)
    .then(project => project.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});
*/

module.exports = router;