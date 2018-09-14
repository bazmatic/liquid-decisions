import { EventTypes, ProposalResolver } from '../src/modules/ProposalResolver'

type Actor = {
    addr: string,
    key: string
}

const Actors = {
    Andrew: {
        addr: "0x43E6dC8daAe48E1Dc0d1877BE566dA3F3c550801",
        key: "84ab80e002d624c8152b94b384195c673699b31959efa52bd895afa11ba577af"
    },
    Betty: {
        addr: "0xDa436534724b217302E558b41514105b3Df3426c",
        key: "5d4a27118e77b4522099e5652b5cbc243e8d23c08982953db18b6102a632ced5"
    },
    Cedric: {
        addr: "0xfbC3caD0304D44966A2450E76752841e01fE54E2",
        key: "e36d78da1651455d50dc0a92ef2697192c0a37ebb13c34b75062cb905df04090"
    },
    Darlene: {
        addr: "0xbE31f1AE20223c54976ba1173Ea5AB156810dea7",
        key: "f251faf6265b19d8a903aea9df22f2e5a6dc1a34f919385710e1ba068d44d667"
    },
    Edgar: {
        addr: "0x8930339c92a262A364aeF19c681Ec7A4F15bBCC9",
        key: "ff7ac254b00ede2c00da74fb219fc742d8cdc1e62c5f05f88758afdd3bf3cebe"
    }
}


type VoteOutcome = {
    yes: number
    no: number
    lost: number
}

type TestAction = {
    actor: Actor
    event: EventTypes
    eventValue: any
}

type TestCase = {
    info: string
    sequence: TestAction[]
    expectedOutcome: VoteOutcome
}

const PROPOSAL_1 = 1

const testCases: TestCase[] = [
    {
        info: 'Vote yes',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            }
        ],
        expectedOutcome: {
            yes: 1,
            no: 0,
            lost: 0
        }
    },
    {
        info: 'Vote yes, then delegate, then delegatee votes no',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            },
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
            {
                actor: Actors.Edgar,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            }
        ],
        expectedOutcome: {
            yes: 0,
            no: 2,
            lost: 0
        }       
    },
    {
        info: 'Delegate, then undelegate by vote yes, then delegatee votes no',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
            {
                actor: Actors.Andrew,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            },
            {
                actor: Actors.Edgar,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            }
        ],
        expectedOutcome: {
            yes: 1,
            no: 1,
            lost: 0
        }       
    },
    {
        info: 'Delegate, then delegatee fails to vote',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
        ],
        expectedOutcome: {
            yes: 0,
            no: 0,
            lost: 1
        }       
    },
    {
        info: 'Delegate, then delegatee delegates, then ultimate delegate vote yes',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            },
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Darlene
            },
            {
                actor: Actors.Darlene,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
            {
                actor: Actors.Edgar,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            }
        ],
        expectedOutcome: {
            yes: 3,
            no: 0,
            lost: 0
        }       
    },
    {
        info: 'Twofold delegation yes, two individuals vote no',
        sequence: [

            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Darlene
            },
            {
                actor: Actors.Darlene,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
            {
                actor: Actors.Edgar,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            },
            {
                actor: Actors.Betty,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            },
            {
                actor: Actors.Cedric,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            },
        ],
        expectedOutcome: {
            yes: 3,
            no: 2,
            lost: 0
        }       
    },
    {
        info: 'Twofold delegation yes, two individuals vote no, first delegate undelegates by voting no',
        sequence: [

            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Darlene
            },
            {
                actor: Actors.Darlene,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Edgar
            },
            {
                actor: Actors.Edgar,
                event: EventTypes.CastVoteEvent,
                eventValue: true
            },
            {
                actor: Actors.Betty,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            },
            {
                actor: Actors.Cedric,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            },
            {
                actor: Actors.Darlene,
                event: EventTypes.CastVoteEvent,
                eventValue: false
            },
        ],
        expectedOutcome: {
            yes: 1,
            no: 4,
            lost: 0
        }       
    },
    {
        info: 'Circular delegation',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Betty
            },
            {
                actor: Actors.Betty,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Andrew
            },
        ],
        expectedOutcome: {
            yes: 0,
            no: 0,
            lost: 2
        }       
    }, 
    {
        info: 'Circular delegation 2',
        sequence: [
            {
                actor: Actors.Andrew,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Betty
            },
            {
                actor: Actors.Betty,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Cedric
            },
            {
                actor: Actors.Cedric,
                event: EventTypes.DelegateVoteEvent,
                eventValue: Actors.Andrew
            },
        ],
        expectedOutcome: {
            yes: 0,
            no: 0,
            lost: 2
        }       
    },
]

function makeJestTestData(): any[][] {
    return testCases.map((testCase: TestCase) => {
        return [testCase.info, testCase.sequence, testCase.expectedOutcome]
    })
}

function makeEventsFromTestSequence(sequence: TestAction[]): any[] {
    return sequence.map((testAction: TestAction) => {

        let result: any = {
            event: testAction.event,
            returnValues: {}    
        }
        if (testAction.event == EventTypes.CastVoteEvent) {
            result.returnValues.voter = testAction.actor.addr  
            result.returnValues.value = testAction.eventValue
        }
        else if (testAction.event == EventTypes.DelegateVoteEvent) {
            result.returnValues.voter = testAction.actor.addr  
            result.returnValues.delegatee = testAction.eventValue.addr
        }
        else {
            throw new Error (`Unknown event type ${testAction.event}`)
        }
        return result
    })
}

let jestTestData = makeJestTestData()

test.each(jestTestData)('%s', async (info, sequence, expectedOutcome)=> {
    const events = makeEventsFromTestSequence(sequence)
    let resolver = new ProposalResolver(PROPOSAL_1)
    let result: any = await resolver.calculateResult(events)
    expect(result.yes).toBe(expectedOutcome.yes)
    expect(result.no).toBe(expectedOutcome.no)
    // expect(result.lost).toBe(expectedOutcome.lost) //TODO: Work out a sensible approach for what constitutes as "lost" vote
})
