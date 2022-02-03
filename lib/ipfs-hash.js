"use strict";

const { MemoryDatastore } = require('datastore-core');
const { MemoryBlockstore } = require('blockstore-core');

const { createRepo } = require('ipfs-repo');
const { MemoryLock } = require('ipfs-repo/locks/memory');
const rawCodec = require('multiformats/codecs/raw');

const IPFS = require('ipfs-core');
const repo = createRepo(
  '',
  async () => rawCodec,
  {
    blocks: new MemoryBlockstore(),
    datastore: new MemoryDatastore(),
    keys: new MemoryDatastore(),
    pins: new MemoryDatastore(),
    root: new MemoryDatastore()
  },
  { autoMigrate: false, repoLock: MemoryLock, repoOwner: true }
);
  
module.exports = {
  start: function (content) {
    return IPFS.create({ repo: repo, offline: true, start: false, silent: true }).then(function (node) {
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