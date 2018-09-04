import Web3 from 'web3';
var contractJson = require('../../../contracts/LiquidDecisions.json')

const web3 = new Web3('https://ropsten.infura.io/s1tfpFETHbLYVlvd7CRk');
//const web3 = new Web3('https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk');

var STARTING_BLOCK = 1891409;
const abi = contractJson.abi
const contract: any = new web3.eth.Contract(abi, abi.deployedAddress)
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

    export function makeProposal(title: string, uri: string, duration: number, tag: string) {     
        contract.makeProposal(title, uri, duration, tag)
    }

    export function castVote(proposalId: number, value: boolean) {
        contract.castVote(proposalId, value)
    }

    export function delegateVote(proposalId: number, delegatee: string) {
        contract.delegateVote(proposalId, delegatee)
    }

    export  function delegateTaggedVotes(tag: string, delegatee: string) {
        contract.delegateTaggedVotes(tag, delegatee)
    }

    export function registerDelegatee(name: string) {
        contract.registerDelegatee(name)
    }

    export async function getDelegatees(): Promise<Delegatee[]> {

            return new Promise<Delegatee[]>(async (resolve, reject) => {
                try {
                    let count = parseInt(await contract.methods.delegateeCount().call(), 10);
                    let delegatees: Delegatee[] = []
            
                    for (let i=0; i< count; i++) {
                        let delegatee: Delegatee = await this.contract.methods.delegatees(i).call()
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
                let count = parseInt(await contract.methods.proposalCount().call(), 10);
                let proposals: Proposal[] = []
        
                for (let i=0; i< count; i++) {
                    let proposal: Proposal = await this.contract.methods.proposals(i).call()
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

    
