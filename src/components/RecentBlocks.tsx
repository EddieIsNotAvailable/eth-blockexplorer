'use client';

import {usePublicClient} from "@/context/PublicClientContext";
import { BlockData } from "@/lib/definitions";

export default function RecentBlocks() {
    const {blockHistory, currentChain} = usePublicClient();

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-1/3 p-10 bg-gray-200 rounded shadow-lg">
            <p>Latest {currentChain.name} Blocks</p>
            <br />
            <div className="flex justify-between border-b border-black">
                <p>Block Number</p>
                <p># txns</p>
            </div>
                {blockHistory && blockHistory.map((block: BlockData) => {
                    return (
                        <div key={block.number} className="flex justify-between">
                            <p>{block.number.toString()}</p>
                            <p>{block.txCount.toString()}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
