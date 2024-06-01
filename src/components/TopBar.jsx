'use client';
import { usePublicClient } from "@/context/PublicClientContext";
import { formatGas } from "@/lib/utility";
import CustomDropdown from "@/components/CustomDropdown";
import { useState, useEffect } from "react";
import { supportedChains } from "@/lib/utility";

export default function TopBar() {
  const { currentBlock, avgGas, currentChain, setChain } = usePublicClient();
  const [selectedChain, setSelectedChain] = useState(() => supportedChains.find(({ chain }) => chain.id === currentChain.id) || supportedChains[0]);

  useEffect(() => {
    setSelectedChain(supportedChains.find(({ chain }) => chain.id === currentChain.id) || supportedChains[0]);
  }, [currentChain]);

  const handleChainChange = (chain) => {
    setChain(chain);
  };

  return (
    <section className="block bg-white sticky top-0 py-1 border-b">
      <div className="cont flex items-center justify-between">
        <div className="flex text-sm gap-4 w-full items-center">
          <div className="flex text-sm">
            <span>Block:</span>
            <div className="blueText">{currentBlock?.number.toLocaleString() || 'Loading...'}</div>
          </div>
          <div className="flex text-sm">
            <span>Gas:</span>
            <div className="blueText"> {avgGas ? formatGas(currentBlock?.baseFeePerGas) : ' '}</div>
          </div>
          <div className="flex text-sm">
            <span className="flex">(Avg:
            <div className="blueText flex">{avgGas ? formatGas(avgGas) : ' '}</div>
            )</span>
          </div>
        </div>

        <div className="flex items-center">
          <CustomDropdown selectedChain={selectedChain} handleChainChange={handleChainChange} />
        </div>
      </div>
    </section>
  );
}
