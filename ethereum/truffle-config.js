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

const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = 'volume armor grid enroll lend task find because frame rhythm isolate phone'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/f14f652a2fed48aba9076ebee00cb555') 
      },
      network_id: '3',
      gas: 4500000,
      gasPrice: 10000000000,
    },
    development: {
        host: "localhost",
        port: 7545,
        network_id: "5777"
    }

  },
  compilers: {
    solc: {
      version: "0.5.17"
    }
  }

};
