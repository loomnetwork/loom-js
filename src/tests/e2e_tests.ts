// Client WS-RPC
import './e2e/ws-rpc-client-tests'

// Loom Provider
import './e2e/loom-provider-tests'
import './e2e/loom-provider-eth-get-logs'
import './e2e/loom-provider-eth-filters'
import './e2e/loom-provider-eth-filters-2'
import './e2e/loom-provider-subscribe'
import './e2e/loom-provider-web3-tests'
import './e2e/loom-provider-web3-middlewares-tests'
import './e2e/loom-provider-web3-child-events'

// EVM
import './e2e/client-evm-tests'
import './e2e/client-evm-event-tests'
import './e2e/client-evm-event-tests-2'

// Middlewares
import './e2e/client-test-tx-cache'
import './e2e/client-test-tx-middleware'
import './e2e/tron-test-tx-middleware'
import './e2e/binance-test-tx-middleware'

// Events
import './e2e/multiple-events-nd-tests'

// Contracts
import './e2e/coin-tests'
import './e2e/ethcoin-tests'
import './e2e/address-mapper-tests'

// TODO: Re-enable this once e2e test for oracle able to ping local ganache
// import './e2e/transfer-gateway-tests'

// TODO: Re-enable once this is updated to DPOSv2
//import './e2e/dpos-tests'

// Weave Blueprint Contract
import './e2e/contract-tests'

// Simple Store Contract
import './e2e/evm-contract-tests'
