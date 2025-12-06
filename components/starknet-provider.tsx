"use client";

import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Always show recommended connectors
    includeRecommended: "always",
    // Randomize the order of the connectors.
    order: "random",
  });

  // Use jsonRpcProvider with custom RPC URL from environment
  const provider = jsonRpcProvider({
    rpc: (chain) => {
      const rpcUrl = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || "https://starknet-mainnet.g.alchemy.com/v2/demo";
      
      if (chain.id === mainnet.id) {
        return {
          nodeUrl: rpcUrl,
        };
      }
      return {
        nodeUrl: "https://starknet-sepolia.g.alchemy.com/v2/demo",
      };
    },
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
