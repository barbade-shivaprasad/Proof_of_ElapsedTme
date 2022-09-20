const crypto = require("crypto");

class Block {
    constructor(timestamp, transactions, previousHash = "", hash) {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.data = transactions;
      this.hash = hash || this.calculateHash();
    }
  
    calculateHash() {
      return crypto
        .createHash("sha256")
        .update(this.previousHash + this.timestamp + JSON.stringify(this.data))
        .digest("hex");
    }
  }

  module.exports = Block;