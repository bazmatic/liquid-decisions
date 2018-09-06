import Web3 from 'web3';
import { resolve } from 'url';
var contractJson = require('../../../ethereum/build/contracts/LiquidDecisions.json')

//const web3 = new Web3('https://ropsten.infura.io/s1tfpFETHbLYVlvd7CRk');
//const web3Reader = new Web3('https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk');
const web3Reader = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))
const web3Writer = window['web3']

const NETWORK_ID = "5777" //4

var STARTING_BLOCK = 1891409;
const abi = contractJson.abi
const contractReader: any = new web3Reader.eth.Contract(abi, contractJson.networks[NETWORK_ID].address)
const contractWriter: any = web3Writer.eth.contract(abi).at(contractJson.networks[NETWORK_ID].address)
//const contractWriter = uport.contract(abi).at(abi.deployedAddress);


export type Voter = {
    address: string
    delegatee: Voter
    delegators: any
    voteValue: boolean  
    processed: boolean
}

export type Proposal = {
    title: string
    uri: string
    duration: number
    tag: string  
}

export type Delegatee = {
    name: string
    address: string
    key?: number
}



export namespace Contract {
    export async function getEvents(proposalId: number)  {

        let events: Array<any> = (await this.contract.getPastEvents(
            'allEvents',
            {
                //filter: {proposalId: proposalId.toString()}, 
                fromBlock: STARTING_BLOCK,
                toBlock: 'latest'
            },
        )).filter((item)=>(item.returnValues.proposalId == proposalId))

        return events 
    }

    export function makeProposal(title: string, uri: string, duration: number, tag: string): Promise<any> {  
        return new Promise((resolve, reject) => {
            contractWriter.makeProposal(title, uri, duration, tag, (err: Error, data: any) => {
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
        contractWriter.castVote(proposalId, value)
    }

    export function delegateVote(proposalId: number, delegatee: string) {
        contractWriter.delegateVote(proposalId, delegatee)
    }

    export  function delegateTaggedVotes(tag: string, delegatee: string) {
        contractWriter.delegateTaggedVotes(tag, delegatee)
    }

    export function registerDelegatee(name: string) {
        contractWriter.registerDelegatee(name)
    }

    export async function getDelegatees(): Promise<Delegatee[]> {

            return new Promise<Delegatee[]>(async (resolve, reject) => {
                try {
                    let count = parseInt(await contractReader.methods.delegateeCount().call(), 10);
                    let delegatees: Delegatee[] = []
            
                    for (let i=0; i< count; i++) {
                        let delegatee: Delegatee = await contractReader.methods.delegatees(i).call()
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
                let count = parseInt(await contractReader.methods.proposalCount().call(), 10);
                let proposals: Proposal[] = []
        
                for (let i=0; i< count; i++) {
                    let proposal: Proposal = await contractReader.methods.proposals(i).call()
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

    
