import Layout from '@/components/Layout';
import '@/styles/globals.css';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { xdcTestnet } from 'wagmi/chains';

const chains = [xdcTestnet];
const projectId = 'c1b3dd468ccc5a2f6adf26ffc141357b';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
