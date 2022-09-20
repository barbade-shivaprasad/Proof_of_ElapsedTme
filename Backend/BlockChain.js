const Block = require('./Block');

class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
  
    createGenesisBlock() {
      return new Block(Date.parse("2017-01-01"), {}, "0");
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
    getPreviousBlockHash() {
      return this.chain[this.chain.length - 1].hash;
    }
  }

module.exports = Blockchain;