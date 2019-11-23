const router = require('express').Router()

// db parameter allows router to have access to database from api.js
module.exports = (db) => {
  // sign up for a new account
  router.post('/signup', (req, res) => {
    // do not allow login/signup if user already logged in
    if (!db.checkValidLogin(req)) {
      res.send('SIGNUP ERROR: ' + req.session.user + ' is already logged in!')
    } else {
      const { username, password } = req.body
      db.addUser(username, password, (data, err) => {
        // if no error, render the user added
        if (!err) {
          res.json(data)
        } else {
          // find some way to render the data
          res.send('SIGNUP ERROR: ' + err)
        }
      })
    }
  })

  // log in for a new account
  router.post('/login', (req, res) => {
    // do not allow login/signup if user already logged in
    if (!db.checkValidLogin(req)) {
      res.send('LOGIN ERROR: ' + req.session.user + ' is already logged in!')
    } else {
      const { username, password } = req.body
      db.loginUser(username, password, (data, err) => {
        // if no error, render the user added
        if (!err) {
          // set user
          req.session.user = data
          res.json(req.session.user)
        } else {
          // find some way to render the data
          res.send('LOGIN ERROR: ' + err)
        }
      })
    }
  })

  // remove current user
  router.post('/logout', (req, res) => {
    // do not allow logout if there is no user logged in
    if (!req.session.user) {
      res.send('LOGOUT ERROR: Nobody is logged in!')
    } else {
      req.session.user = null
      res.send('Logged out: ' + req.session.user)
    }
  })

  // access json of all users
  router.get('/users', (req, res) => {
    db.getAllUsers((data, err) => {
      // if no error, the data of all users
      if (!err) {
        res.json(data)
      } else {
        // find some way to render the data
        res.send('LOGIN ERROR: ' + err)
      }
    })
  })

  return router
}