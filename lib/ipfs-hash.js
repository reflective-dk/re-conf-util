"use strict";

const IPFS = require('ipfs-core');
    
module.exports = {
  start: function (content) {
    return IPFS.create().then(function (node) {
      return new ipfs(node);
    });
  }
}

function ipfs(node) {
  this.node = node;
  
  this.stop = function () {
    return this.node.stop();
  }
  
  this.hash = function (content) {
    return this.node.add(content)
    .then(function (result) {
      return result.cid.toString();
    });
  }
}