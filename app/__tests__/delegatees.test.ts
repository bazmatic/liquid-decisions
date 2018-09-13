//import {} from 'jest'
import * as Ethers from 'ethers'
const ContractJson = require('../../ethereum/build/contracts/LiquidDecisions.json')

const provider = new Ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
const contractAddress = ContractJson.networks['5777'].address
var contract = new Ethers.Contract(contractAddress, ContractJson.abi, provider)

describe('Delegatees', () => {
    test('Add delegatee', () => {



        //Create random wallet
        //Provider
        expect(1).toEqual(1)
    })
})