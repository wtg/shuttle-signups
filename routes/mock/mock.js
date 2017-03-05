"use strict";
//include all required helper files
const express = require('express');
const router = express.Router();
module.exports = router;
router.get('/*',function(req,res){
  //check if the file exists in the mock folder
  //don't run this in production systems b/c of file path traversal.
  res.sendFile(__dirname + req.url.substring(0,req.url.length -1) + ".json")
});
