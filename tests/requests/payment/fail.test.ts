import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import { isInstalled, merchantName, isUnlocked } from './../../utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })

  document.dispatchEvent(installEvent)
})

it('Fail Payment request due to extension lock', async () => {
  const txData = {
    address: '',
    amount: '',
    coin: '',
    payload: ''
  }

  await expect(instance.paymentRequest(txData)).rejects.toMatch('Extension locked')
})

it('Fail payment request due to user rejct', async () => {
  document.addEventListener(MinterLinkEvent.PaymentRequest, () => {
    const rejectEvent = new CustomEvent(MinterLinkEvent.PaymentReject)

    document.dispatchEvent(rejectEvent)
  })

  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })

  document.dispatchEvent(unlockEvent)

  const txData = {
    address: '',
    amount: '',
    coin: '',
    payload: ''
  }
  await expect(instance.paymentRequest(txData)).rejects.toMatch('Rejected by user')
})