import os
import json
from web3 import Web3, HTTPProvider
from eth_account import Account
from web3.middleware import construct_sign_and_send_raw_middleware

private_key = os.getenv('PRIVATE_KEY')

w3 = Web3(Web3.HTTPProvider("https://kovan.infura.io/v3/663bcd65903948a6b53cd96866fc1a4a"))
acct = Account.from_key(private_key)

print("Private key: " + acct.privateKey.hex())
print("Address: " + acct.address)
print("Balance: " + str(w3.eth.getBalance(acct.address)))

#w3.eth.defaultAccount = acct

compiled_json = json.load(open("/projects/liquid-decisions/ethereum/build/contracts/LiquidDecisions.json"))
abi = compiled_json['abi']

#Kovan
LiqDec = w3.eth.contract(address='0x484D17378476e58F6d28806dbd9928b3dF522D62', abi=abi)

w3.middleware_onion.add(construct_sign_and_send_raw_middleware(acct.privateKey))
tx = { 'from': acct.address }
tx_hash = LiqDec.functions.makeProposal("another title", "uri", 100000000, "tag").transact(tx)
print("Waiting for transaction receipt from " + tx_hash.hex())
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
print(tx_receipt)
