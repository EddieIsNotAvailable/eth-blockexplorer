import { useState } from "react";
import Image from "next/image";
import { mainnet, sepolia, arbitrum, optimism } from "viem/chains";

const supportedChains = [
  { chain: mainnet, logo: "/Ethereum.svg", name: 'Mainnet' },
  { chain: sepolia, logo: "/Sepolia.svg", name: 'Sepolia' },
  { chain: arbitrum, logo: "/Arbitrum One.svg", name: 'Arbitrum' },
  { chain: optimism, logo: "/OP Mainnet.svg", name: 'Optimism' }
];

export default function CustomDropdown({ selectedChain, handleChainChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={toggleDropdown}
        >
          <div className="flex items-center">
            <div className="logo-container">
              <Image src={selectedChain.logo} alt={selectedChain.name} width={16} height={16} />
            </div>
            <span className="ml-2">{selectedChain.name}</span>
          </div>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707 1.707L5.414 10l5.293 5.293A1 1 0 0110 17a1 1 0 01-.707-.293l-6-6a1 1 0 010-1.414l6-6A1 1 0 0110 3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {supportedChains.map(({ chain, logo, name }) => (
              <button
                key={chain.id}
                onClick={() => {
                  handleChainChange(chain);
                  toggleDropdown();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="logo-container">
                  <Image src={logo} alt={name} width={16} height={16} />
                </div>
                <span className="ml-2">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
