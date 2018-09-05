var LiquidDecisionsContract = artifacts.require("../contracts/LiquidDecisions.sol");

module.exports = function(deployer) {
	deployer.deploy(LiquidDecisionsContract).then(()=>{
        console.log("Address of contract", LiquidDecisionsContract.address);
    })
};