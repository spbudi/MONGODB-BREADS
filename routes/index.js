var express = require('express');
var router = express.Router();
const moment = require('moment');
const { ObjectId } = require('bson');

module.exports = (db) => {
  router.get('/', function (req, res, next) {
    db.collection('todos')
      .find()
      .toArray((err, data) => {
        if (err) return res.send(err);
        res.render('list', { item: data, moment });
      });
  });

  router.get('/add', function (req, res, next) {
    res.render('add', {});
  });

  router.post('/add', (req, res) => {
    var myobj = {
      string: `${req.body.string}`,
      integer: parseInt(req.body.integer),
      float: JSON.parse(req.body.float),
      date: new Date(`${req.body.date}`),
      boolean: JSON.parse(req.body.boolean),
    };
    db.collection('todos').insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log('1 document inserted');
    });
    res.redirect('/');
  });

  router.get('/edit/:id', (req, res) => {
    db.collection("todos").find({ "_id": ObjectId(`${req.params.id}`) }).toArray((err, data) => {
        if (err) {
            console.log(err)
        } 
        res.render('edit', { item: data[0], moment })
    })
})

router.post('/edit/:id', (req, res) => {

    let myobj = {
        string: `${req.body.string}`,
        integer: parseInt(req.body.integer),
        float: JSON.parse(req.body.float),
        date: new Date(req.body.date),
        boolean: req.body.boolean
    }

    db.collection("todos").updateOne({ "_id": ObjectId(`${req.params.id}`) }, { $set: myobj }, (err, res) => {
        if (err) throw err
    })
    res.redirect('/')
})

  router.get('/delete/:id', (req, res) => {
    db.collection("todos").deleteOne({ "_id": ObjectId(`${req.params.id}`) }, (err) => {
        if (err) {
            console.error(err)
        }
    })
    res.redirect('/')
})
    
  return router;
};
