'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var Task = require('../api/task/task.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user ID in the request is the currently authenticated user
 * Otherwise returns 403
 */
function isUser(roleRequired) {
  return compose()
    // make sure the user is actually logged in
    .use(isAuthenticated())
    .use(function (req, res, next) {
      if (req.user._id == req.params.id) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Checks if currently authenticated user owns the current task
 * Otherwise returns 403
 */
function isTaskOwner(roleRequired) {
  return compose()
    // make sure the user is actually logged in
    .use(isAuthenticated())
    .use(function (req, res, next) { 
      if (req.user._id) {
        Task.findById(req.params.id, function (err, task) {
          if (err) return next(err);
          if (!task) return res.send(401);
          if( task.user.toString() != req.user._id.toString() ) return res.send(403);
          next();
        });
      }
      else {
        res.send(403);
      }
    });
}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.isUser = isUser;
exports.isTaskOwner = isTaskOwner;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;