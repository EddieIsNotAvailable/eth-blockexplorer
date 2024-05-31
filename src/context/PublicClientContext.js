'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { http, createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import {Block} from "viem";

export function PublicClientProvider( {children} ) {
  let defaultChain = null;
  if(typeof window !== 'undefined') {
    defaultChain = localStorage.getItem('chain') ? JSON.parse(localStorage.getItem('chain')) : mainnet;
  }

  const [currentChain, setChain] = useState(defaultChain);
  const [client, setClient] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [avgGas, setAvgGas] = useState(BigInt(0));

  let blockHistory = [];
  let totalGas = BigInt(0);

  function updateBlockHistory(block) {
    if(blockHistory.length >9) {
      totalGas -= blockHistory[0].baseFeePerGas;
      blockHistory.shift();
    }

    const thisBlock = {
      number: block.number,
      baseFeePerGas: block.baseFeePerGas,
      miner: block.miner,
      txCount: block.transactions.length,
    };

    setCurrentBlock(thisBlock);
    const len = blockHistory.push(thisBlock);
    totalGas += block.baseFeePerGas;
    setAvgGas(totalGas / BigInt(len));
  }

  const updateChain = (chain) => {
    setChain(chain);
    if(typeof window !== 'undefined') {
      localStorage.setItem('chain', JSON.stringify(chain));
    }
  }

  useEffect(() => {
    const c = createPublicClient({
      chain: currentChain,
      transport: http(),
    });
    setClient(c);
  }, [currentChain]);

  useEffect(() => {
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
    <PublicClientContext.Provider value={{ client, setChain, currentBlock, avgGas}}>
      {children}
    </PublicClientContext.Provider>
  );
}

export const PublicClientContext = createContext();

export const usePublicClient = () => useContext(PublicClientContext);