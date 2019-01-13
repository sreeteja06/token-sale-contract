/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const { seed } = require('./seed');
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = seed;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development:{
      host: "127.0.0.1",
      port: "7545",
      network_id: "*"   //match any network id
    },
    rinkeby:{
      provider: ()=>{
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/ec2f8b79db3b4da587c4c5299162f65c");
      },
      network_id: 4
    }
  }
};
