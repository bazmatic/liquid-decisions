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
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk') 
      },
      network_id: '3',
      gas: 4500000,
      gasPrice: 10000000000,
    },
    development: {
        host: "localhost",
        port: 8545,
        network_id: "5777"
    }

  },

};
