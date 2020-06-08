import os
import json
from web3 import Web3, HTTPProvider
from eth_account import Account
from web3.middleware import construct_sign_and_send_raw_middleware
import asyncio


private_key = os.getenv('PRIVATE_KEY')
CONTRACT_ADDRESS = '0x95205ad8f8D92967fa35911B9dD7F4e06769eed8'
CONTRACT_ADDRESS = '0x484D17378476e58F6d28806dbd9928b3dF522D62' # Use old contract 

w3 = Web3(Web3.WebsocketProvider("wss://ropsten.infura.io/ws/v3/ad9d7f95b87b49e8a2ecfdba5f6ecb7e"))
acct = Account.from_key(private_key)

pwd = os.path.dirname(os.path.realpath(__file__)).split('/')
pwd.pop(-1)
parent_dir = '/'.join(x for x in pwd)
print(parent_dir)
print("Private key: " + acct.privateKey.hex())
print("Address: " + acct.address)
print("Balance: " + str(w3.eth.getBalance(acct.address)))

#w3.eth.defaultAccount = acct
abi = json.load(open(parent_dir + "/ethereum/contracts/build/LiquidDecisions.abi"))
# print(abi)
#Kovan
LiqDec = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
for x in LiqDec.all_functions():
    print(x)

w3.middleware_onion.add(construct_sign_and_send_raw_middleware(acct.privateKey))
tx = { 'from': acct.address }
tx_hash = LiqDec.functions.makeProposal("another title", "uri", 100000000, "tag").transact(tx)
print("Waiting for transaction receipt from " + tx_hash.hex())
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
print(tx_receipt)


event_filter = LiqDec.events.ProposalEvent.createFilter(fromBlock=1, toBlock='latest')
# event_filter = w3.eth.filter({"address": CONTRACT_ADDRESS})
print('\n')
print(event_filter.get_new_entries())
print('\n')
print(event_filter.get_all_entries())