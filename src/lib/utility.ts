import {formatGwei} from "viem";
import { mainnet, sepolia, arbitrum, optimism } from "viem/chains";

export function formatGas(gas: bigint): string {
    return parseFloat(formatGwei(gas)).toFixed(2);
}

export const supportedChains = [
    { chain: mainnet, logo: "/Ethereum.svg", name: 'Ethereum' },
    { chain: sepolia, logo: "/Sepolia.svg", name: 'Sepolia' },
    { chain: arbitrum, logo: "/Arbitrum One.svg", name: 'Arbitrum' },
    { chain: optimism, logo: "/OP Mainnet.svg", name: 'Optimism' }
];

export function getChainByName(name: string) {
    return supportedChains.find(chain => chain.name === name)?.chain;
}

//Block times
export const blockTimes = {
    "ethereum" : 4000, //4s
    "sepolia": 4000,
    "arbitrum one": 200, //.25s
    "op mainnet": 1500  //2s
};
