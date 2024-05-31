'use client';
import { usePublicClient } from "@/context/PublicClientContext";
import {formatGwei} from "viem";

function formatGas(gas) {
  return parseFloat(formatGwei(gas)).toFixed(2);
}

export default function TopBar() {
  const { currentBlock, avgGas } = usePublicClient();

  return (
    <div className={`flex flex-w w-full space-x-5`}>
      <p>Block: {currentBlock ? currentBlock.number.toLocaleString() : 'Loading...'}</p>
      <p>Gas Price: { currentBlock ? `${formatGas(currentBlock.baseFeePerGas)} (Avg: ${formatGas(avgGas)}) Txs: ${currentBlock.txCount}`: "Loading..."}</p>
    </div>
  );
}