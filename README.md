# Minter Connect

Minter Connect is a library that provides connection between your web application and [Minter Link](https://github.com/minterscan/minter_link) extension.

With Minter Connect you can connect your website to extension, get access to user wallet address, implement Minter authentication and even make one-click payment requests.

Check [MinterLink Playground](https://github.com/minterscan/minter_link_playground) for live demo.

## Installation
```
npm install minter-connect
```

## Initialize
Minter Connect takes optional **merchant name** parameter on initialization.

```
import MinterConnect from 'minter-connect'

const minterConnect = new MinterConnect('My website')
```

## Subscribe
Following events are available for subscription:
* MinterLinkEvent.IsInstalled
* MinterLinkEvent.IsUnlocked
* MinterLinkEvent.Version
* MinterLinkEvent.Wallet

```
import { MinterLinkEvent } from 'minter-connect'

minterConnect.subscribe(MinterLinkEvent.IsInstalled, (value: boolean) => {
  console.log('Extension installed:', value)
})

minterConnect.subscribe(MinterLinkEvent.IsUnlocked, (value: boolean) => {
  console.log('Extension unlocked:', value)
})

minterConnect.subscribe(MinterLinkEvent.Version, (value: string) => {
  console.log('Extension version:', value)
})

minterConnect.subscribe(MinterLinkEvent.Wallet, (value: string) => {
  console.log('Active Wallet:', value)
})
```

## Connect Request
Request permanent access to  user's active wallet:

```
minterConnect.connectRequest()
  .then((wallet: string) => {
    // Connect accepted, wallet address returned
    console.log(wallet)
  })
  .catch((e) => {
    // Connect rejected
    console.error(e)
  })
```

## Sign Request
Request message, signed with connected wallet private key:

```
import { SignResponse } from 'minter-connect'

minterConnect.signRequest('Message')
  .then((response: SignResponse) => {
    // Signed message (0x-prefixed hex string)
    console.log(response.personalMessage)

    // ECDSASignature (0x-prefixed hex string)
    console.log(response.signature)
  })
  .catch(() => {
    // Sign rejected
    console.error(e)
  })
```

## Payment request
Prepare payment request data & await for response from user:

```
const data = {
  address: 'Mx...',    // Payment address
  amount: 1,           // Payment amount
  coin: 'BIP',         // Payment coin
  payload: 'Order #1'  // Any custom payload up to 1024 bytes
}

minterConnect.paymentRequest(data)
  .then((hash: string) => {
    // Payment accepted, transaction hash returned
    console.log(hash)
  })
  .catch(() => {
    // Payment rejected
    console.error(e)
  })
```
