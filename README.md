![Logo](./img/minter-logo.svg)


[![NPM Package](https://img.shields.io/npm/v/minter-connect?style=flat)](https://www.npmjs.org/package/minter-connect)
[![Coverage Status](https://coveralls.io/repos/github/minterscan/minter_connect/badge.svg?branch=master)](https://coveralls.io/github/minterscan/minter_connect?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/minterscan/minter_connect/blob/master/LICENSE)

**Minter Connect** is a library that provides connection between your web application and [Minter Link](https://github.com/minterscan/minter_link) extension.

With Minter Connect you can connect your website to extension, get access to user wallet address, implement Minter authentication and even make one-click payment requests.

Check [Minter Link Playground](https://github.com/minterscan/minter_link_playground) for live demo.

## Installation
```
npm install minter-connect
```

## Initialize
Minter Connect takes optional `merchant name` parameter on initialization.

```typescript
import MinterConnect from 'minter-connect'

const minterConnect = new MinterConnect('My website')
```

## Subscribe
Following events are available for subscription:
* MinterLinkObservableProps.IsInstalled
* MinterLinkObservableProps.IsUnlocked
* MinterLinkObservableProps.Version
* MinterLinkObservableProps.Wallet

```typescript
import { MinterLinkObservableProps } from 'minter-connect'

minterConnect.subscribe(MinterLinkObservableProps.IsInstalled, (value: boolean) => {
  console.log('Extension installed:', value)
})

minterConnect.subscribe(MinterLinkObservableProps.IsUnlocked, (value: boolean) => {
  console.log('Extension unlocked:', value)
})

minterConnect.subscribe(MinterLinkObservableProps.Version, (value: string) => {
  console.log('Extension version:', value)
})

minterConnect.subscribe(MinterLinkObservableProps.Wallet, (value: string) => {
  console.log('Active Wallet:', value)
})
```

## Connect Request
Request permanent access to  user's active wallet:

```typescript
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

```typescript
import { SignResponse } from 'minter-connect'

minterConnect.signRequest('Message')
  .then((signature: string) => {
    // ECDSA Signature (0x-prefixed hex string)
    console.log(signature)
  })
  .catch(() => {
    // Sign rejected
    console.error(e)
  })
```

## Payment request
Prepare payment request data & await for response from user:

```typescript
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
