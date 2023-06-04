import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.
  const { deploy } = deployments; // The deployments field itself contains the deploy function.
  const { deployer } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

  console.log("deployer address", deployer);

  const ERC2309Test = await deploy("ERC2309Test", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("ERC2309Test deploy to : ", ERC2309Test.address);
};

export default func;
func.id = "Deploy_ERC2309Test_goerli"; // id required to prevent reexecution
func.tags = ["deploy_goerli"];
