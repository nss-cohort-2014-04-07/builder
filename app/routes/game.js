'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper');
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (e, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0,100) !== 70;
    trees.save(tree, (e, count)=>res.render('game/tree', {tree: tree, treeHelper:treeHelper}));
  });
};

// exports.grow = (req, res)=>{
//   var treeId = Mongo.ObjectID(req.params.treeId);
//
//   trees.findOne({_id:treeId}, (e, tree)=>{
//     tree.height += _.random(0, 2);
//     tree.isHealthy = _.random(0,100) !== 70;
//     trees.save(tree, (e, count)=>{
//       res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{
//         res.send(html);
//       });
//     });
//   });
// };

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  var userId = Mongo.ObjectID(req.params.userId);

  trees.findOne({_id:treeId}, (e, tree)=>{
    users.findOne({_id:userId}, (e, user)=>{
      var wood = tree.height / 2;
      user.wood += wood;

      users.save(user, (e, count)=>{
        tree.height = 0;
        tree.isHealthy = false;
        tree.isChopped = true;
        trees.save(tree, (e, count)=>{
          res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{
            res.send(html);
          });
        });
      });
    });
  });
};

exports.dashboard = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  users.findOne({_id:userId}, (e,obj)=>{
    res.render('game/dashboard', {user: obj}, (e, html)=>{
      res.send(html);
    });
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  trees.find({userId:userId}).toArray((e,objs)=>{
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username:user.username}, (e,fobj)=>{
    if(fobj){
      res.render('game/dashboard', {user: fobj}, (e, html)=>{
        res.send(html);
      });
    }else{
      users.save(user, (e,sobj)=>{
        res.render('game/dashboard', {user: sobj}, (e, html)=>{
          res.send(html);
        });
      });
    }
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (e,obj)=>{
    res.render('game/tree', {tree: obj, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
};
