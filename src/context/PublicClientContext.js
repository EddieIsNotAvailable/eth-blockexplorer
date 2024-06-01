'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { http, createPublicClient } from 'viem';
import { getChainByName, blockTimes } from "@/lib/utility";
import { supportedChains } from "@/lib/utility";
import {mainnet} from "viem/chains";

export function PublicClientProvider({ children }) {
  const defaultChain = mainnet;
  console.log("def chain: ",defaultChain);
  const [currentChain, setChain] = useState(defaultChain);
  const [client, setClient] = useState(null);
  const [avgGas, setAvgGas] = useState(BigInt(0));
  const [blockHistory, setBlockHistory] = useState([]);
  const [currentBlock, setCurrentBlock] = useState();

  let totalGas = BigInt(0);

  function updateBlockHistory(block) {
    const newBlockHistory = blockHistory;
    let len = newBlockHistory.length;
    if(len > 9) {
      totalGas -= newBlockHistory[len-1].baseFeePerGas;
      blockHistory.pop();
    }

    const thisBlock = {
      number: block.number,
      baseFeePerGas: block.baseFeePerGas,
      miner: block.miner,
      txCount: block.transactions.length,
    };

    setCurrentBlock(thisBlock);
    len = newBlockHistory.unshift(thisBlock);
    setBlockHistory(newBlockHistory);
    totalGas += block.baseFeePerGas;
    setAvgGas(totalGas / BigInt(len));
  }

  const updateChain = (chain) => {
    setChain(chain);
    if(typeof window !== 'undefined') {
      localStorage.setItem('chain', chain.name);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chain');
      if (stored) {
        setChain(getChainByName(stored));
      }
    }
  }, []);

  useEffect(() => {
    console.log(currentChain);
    const c = createPublicClient({
      pollingInterval: blockTimes[currentChain.name.toLowerCase()],
      chain: currentChain,
      transport: http(),
    });
    setClient(c);
    setBlockHistory([]);
  }, [currentChain]);

  useEffect(() => {
    // @ts-ignore
    const unwatch = client?.watchBlocks({
      includeTransactions: true,
      onBlock: (block) => {
        updateBlockHistory(block);
        console.log("New Block: ",block);
      }
    });

    return () => {
      if(unwatch) unwatch();
    }
  }, [client]);

  return (
    <PublicClientContext.Provider value={{ currentChain, setChain, avgGas, currentBlock, blockHistory}}>
      {children}
    </PublicClientContext.Provider>
  );
}

export const PublicClientContext = createContext();

export const usePublicClient = () => useContext(PublicClientContext);