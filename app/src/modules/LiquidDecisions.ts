//const Web3 = require('web3')
import * as Ethers from 'ethers'
import { resolve } from 'url';
var contractJson = require('../../../ethereum/build/contracts/LiquidDecisions.json')

//const web3 = new Web3('https://ropsten.infura.io/s1tfpFETHbLYVlvd7CRk');
//const web3Reader = new Web3('https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk');

//const web3Reader = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
/*
var web3Writer: any
if (window && window['web3']) {
    web3Writer = window?window['web3']:web3Reader
} 
else {
    web3Writer = web3Reader
}
*/

const NETWORK_ID = "5777" //
var SEC_DAY = 60 * 60 * 24
var STARTING_BLOCK = 1;
const abi = contractJson.abi
const contractAddress = contractJson.networks[NETWORK_ID].address

const contractReaderProvider = new Ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")//, {chainId: NETWORK_ID})
const contractReader = new Ethers.Contract(contractAddress, abi, contractReaderProvider)

//window['web3'].providers.HttpProvider.prototype.sendAsync = window['web3'].providers.HttpProvider.prototype.send;
const contractWriterProvider = new Ethers.providers.Web3Provider(window['web3'].currentProvider)

contractWriterProvider.sendAsync = contractWriterProvider.send
const contractWriterSigner = contractWriterProvider.getSigner()
const contractWriter = new Ethers.Contract(contractAddress, abi, contractWriterSigner)
//web3Writer.eth.contract(abi).at(contractJson.networks[NETWORK_ID].address)

//const contractWriter = uport.contract(abi).at(abi.deployedAddress);

export type Voter = {
    addr: string
    delegatee: Voter
    delegators: any
    voteValue: boolean  
    processed: boolean
}

export type Proposal = {
    id?: number
    title: string
    uri: string
    duration: number
    expiryDate?: number
    proposalDate?: number
    proposer?: string
    tag: string  
}

export type Delegatee = {
    name: string
    addr: string
    key?: number
}

export namespace Contract {
    export async function getEvents(proposalId: number)  {

        var filter = {
            fromBlock: STARTING_BLOCK,
            address: contractAddress
        }
        let events: Array<any> = contractReaderProvider.getLogs(filter).filter((item)=>(item.returnValues.proposalId == proposalId))
       // filter((item)=>(item.returnValues.proposalId == proposalId))

        /*let events: Array<any> = (await contractReader.getPastEvents(
            'allEvents',
            {
                //filter: {proposalId: proposalId.toString()}, 
                fromBlock: STARTING_BLOCK,
                toBlock: 'latest'
            },
        )).filter((item)=>(item.returnValues.proposalId == proposalId))
*/
        return events 
    }

    export async function makeProposal(title: string, uri: string, duration: number, tag: string): Promise<any> {  
        return new Promise<any>(async (resolve, reject) => {
            return await contractWriter.makeProposal(title, uri, duration * SEC_DAY, tag)/*, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })*/
        })
    }

    export function registerDelegatee(name: string): Promise<any> {  
        return new Promise<any>((resolve, reject) => {
            contractWriter.registerDelegatee(name, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    export function castVote(proposalId: number, value: boolean) {
        return new Promise<any>((resolve, reject) => {
            contractWriter.castVote(proposalId, value, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    export function delegateVote(proposalId: number, delegatee: string) {
        return new Promise<any>((resolve, reject) => {
            contractWriter.delegateVote(proposalId, delegatee, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    export function delegateTaggedVotes(tag: string, delegatee: string) {
        return new Promise<any>((resolve, reject) => {
            contractWriter.delegateTaggedVotes(tag, delegatee, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    export async function getDelegatees(): Promise<Delegatee[]> {
        return new Promise<Delegatee[]>(async (resolve, reject) => {
            try {
                let count = parseInt(await contractReader.delegateeCount(), 10);
                let delegatees: Delegatee[] = []
        
                for (let i=0; i< count; i++) {
                    let delegatee: Delegatee = await contractReader.delegatees(i)
                    delegatee.key = i;
                    delegatees.push(delegatee);
                }
                resolve(delegatees)
            }
            catch (e) {
                console.error(e)
                resolve([])
            }
        })
    }

    export async function getProposals(): Promise<Proposal[]> {

        return new Promise<Proposal[]>(async (resolve, reject) => {
            try {
                let count = parseInt(await contractReader.proposalCount(), 10);
                let proposals: Proposal[] = []
        
                for (let i=0; i< count; i++) {
                    let proposal: Proposal = await contractReader.proposals(i)
                    proposals.push(proposal);
                }
                resolve(proposals)
            }
            catch (e) {
                console.error(e)
                resolve([])
            }
        })
}
}

    
