const Web3 = require('web3')
import { Connect, SimpleSigner } from 'uport-connect';
import { Credentials } from 'uport'

var contractJson = require('../../../ethereum/build/contracts/LiquidDecisions.json')

//const web3 = new Web3('https://ropsten.infura.io/s1tfpFETHbLYVlvd7CRk');
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
const NETWORK_ID = '4'//"5777" //
const NETWORK_NAME = 'rinkeby'
var SEC_DAY = 60 * 60 * 24
var STARTING_BLOCK = 3010000;

export const uport = new Connect('Liquid Decisions', {
    clientId: '2osjESc49UMhoFwb92W5t5EnuME5pi5Ljda',
    network: NETWORK_NAME,
    signer: SimpleSigner('e59d6fc020eb279b3655a52d48696ed4a37141333e546637a8d3e2b202cb6541')
})

const abi = contractJson.abi
const contractAddress = contractJson.networks[NETWORK_ID].address

const web3Reader = new Web3('https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk');
const contractReader: any = new web3Reader.eth.Contract(abi, contractAddress)
const contractWriter = uport.contract(abi).at(contractAddress);

//const contractWriter: any = (web3Reader == web3Writer)?contractReader:web3Writer.eth.contract(abi).at(contractJson.networks[NETWORK_ID].address)

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
    backgroundUrl: string
    imageUrl?: string
    key?: number
}

export namespace Contract {
    export async function getEvents(proposalId: number)  {

        let events: Array<any> = (await contractReader.getPastEvents(
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
        return contractWriter.makeProposal(title, uri, duration * SEC_DAY, tag)
    }

    export function registerDelegatee(delegatee: Delegatee): Promise<any> {  
        return contractWriter.registerDelegatee(delegatee.name, delegatee.backgroundUrl, delegatee.imageUrl)
    }

    export function castVote(proposalId: number, value: boolean) {
        return contractWriter.castVote(proposalId, value)
    }

    export function delegateVote(proposalId: number, delegatee: string) {
        return contractWriter.delegateVote(proposalId, delegatee)
    }

    export function delegateTaggedVotes(tag: string, delegatee: string) {
        return contractWriter.delegateTaggedVotes(tag, delegatee)
    }

    export async function getDelegatees(): Promise<Delegatee[]> {
        return new Promise<Delegatee[]>(async (resolve, reject) => {
            try {
                let count = parseInt(await contractReader.methods.delegateeCount().call(), 10);
                let delegatees: Delegatee[] = []
        
                for (let i=0; i< count; i++) {
                    let delegatee: Delegatee = await contractReader.methods.getDelegatee(i).call()
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

    
