import type { HardhatUserConfig} from "hardhat/config";
import { vars} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const ownerKey = vars.get("OWNER_PRIVATE_KEY"); 
const INFURA_API_KEY = vars.get("INFURA_API_KEY");



const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ownerKey],
    },
  },
  etherscan: {
  apiKey: vars.get("ETHERSCAN_API_KEY"), // Il te faudra une clé Etherscan gratuite
  },
};

export default config;
