import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import {
  isInstalled,
  isUnlocked,
  hash,
  merchantName,
} from './../../utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })
  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })

  document.dispatchEvent(installEvent)
  document.dispatchEvent(unlockEvent)
})

it('Resolve payment request successfully', async () => {
  document.addEventListener(MinterLinkEvent.PaymentRequest, () => {
    const acceptEvent = new CustomEvent(MinterLinkEvent.PaymentAccept, { detail: hash })

    document.dispatchEvent(acceptEvent)
  })

  const txData = {
    address: '',
    amount: '',
    coin: '',
    payload: ''
  }
  await expect(instance.paymentRequest(txData)).resolves.toEqual(hash)
})