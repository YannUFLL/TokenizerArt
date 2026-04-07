#!/bin/bash

set -e

cd ../code

if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed."
fi

checks_var() {
    VAR_NAME=$1
    if npx hardhat vars list | grep -q "$VAR_NAME"; then 
        echo "✅ $VAR_NAME is define"
    else
        echo "❌ Error: $VAR_NAME is not define" 
        npx hardhat vars set $VAR_NAME 
    fi 
}

cd ../code
checks_var "OWNER_PRIVATE_KEY"
checks_var "ETHERSCAN_API_KEY"
checks_var "INFURA_API_KEY"

npx hardhat compile 
if [[ -f ignition/deployments/chain-11155111/deployed_addresses.json ]]; then
    echo "Contract already deploy at $(cat ignition/deployments/chain-11155111/deployed_addresses.json)" 
fi
npx hardhat ignition deploy ignition/modules/Twingo42.ts --network sepolia --verify
npx hardhat console --network sepolia