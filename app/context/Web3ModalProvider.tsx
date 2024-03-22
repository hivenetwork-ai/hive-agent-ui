'use client'

import {createWeb3Modal, defaultConfig} from '@web3modal/ethers/react'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
    name: 'Hive Network',
    description: 'Decentralized AI Agent Network',
    url: 'https://app.hivenetwork.ai', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
    ethersConfig: defaultConfig({metadata}),
    chains: [mainnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeVariables: {
        '--w3m-accent': '#26272B',
        '--w3m-color-mix': '#FDB022',
        '--w3m-color-mix-strength': 30
    }
})

export function Web3ModalProvider({children}: any) {
    return children
}
