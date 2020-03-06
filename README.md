# Minter Connect

Minter Connect is a library that provides connection between your web application and [Minter Link](https://github.com/minterscan/minter_link) extension

## Installation
```
npm install minter-connect
```

## Using
Minter Connect takes optional **merchant** object on initialization. It contains two fields: **name** and **url** of your website.

```
import MinterConnect from 'minter-connect'

const minterConnect = new MinterConnect({
  name: 'My merchant',
  url: 'https://merchant.domain'
})
```

## Subscribing
Following events are available for subscription:
* isInstalled
* isUnlocked
* version

```
minterConnect.subscribe('isInstalled', (value: boolean) => {
  console.log('Extension installed:', value)
})

minterConnect.subscribe('isUnlocked', (value: boolean) => {
  console.log('Extension unlocked:', value)
})

minterConnect.subscribe('version', (value: string) => {
  console.log('Extension version:', value)
})
```

## Payment request
Prepare payment request data & await for response from extension:

```
const data = {
  address: 'Mx...',    // Your merchant address
  amount: 1,           // Payment amount
  coin: 'BIP',         // Payment coin
  payload: 'Order #1'  // Any custom payload up to 1024 bytes
}

minterConnect.paymentRequest(data)
  .then(() => {
    // Request accepted
  })
  .catch(() => {
    // Request rejected
  })
```

## Build
```
npm install
npm run build
```