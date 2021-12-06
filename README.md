# Cardano Wallet Functions
Common functions for the cardano-wallet backend

## Methods implemented

- getNetworkSyncState
- createWallet (and generate mnemonic)
- getWalletSnapshot
- getWalletAssets
- getAccountPublicKey

## Troubleshooting CORS
<p>If you are cloning the repo and running in local environment then you are likely
to get errors related to CORS. To solve it you should run a local proxy server</p>

`lcp --proxyUrl https://cnode.dynamicstrategies.io:8010/v1/graphql`

<p>And then you should point all your graphQL API queries to </p>

`http://localhost:8010/proxy`

<p>The issue with CORS is well explained here</p>

[Link](https://medium.com/tribalscale/stop-cursing-cors-c2cbb4997057)