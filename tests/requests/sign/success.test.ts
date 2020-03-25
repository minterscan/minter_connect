import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import {
  isInstalled,
  isUnlocked,
  wallet,
  merchantName,
  personalMessage,
  signature
} from './../../utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })
  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })
  const walletEvent = new CustomEvent(MinterLinkEvent.Wallet, { detail: wallet })

  document.dispatchEvent(installEvent)
  document.dispatchEvent(unlockEvent)
  document.dispatchEvent(walletEvent)
})

it('Resolve sign request successfully', async () => {
  document.addEventListener(MinterLinkEvent.SignRequest, () => {
    const acceptEvent = new CustomEvent(MinterLinkEvent.SignAccept, { detail: {
      personalMessage,
      signature
    } })

    document.dispatchEvent(acceptEvent)
  })

  const response = await instance.signRequest('')

  expect(response.personalMessage).toEqual(personalMessage)
  expect(response.signature).toEqual(signature)
})