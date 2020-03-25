import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import {
  isInstalled,
  isUnlocked,
  wallet,
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

it('Resolve connect request successfully', async () => {
  document.addEventListener(MinterLinkEvent.ConnectRequest, () => {
    const acceptEvent = new CustomEvent(MinterLinkEvent.ConnectAccept, { detail: wallet })

    document.dispatchEvent(acceptEvent)
  })

  const response = await instance.connectRequest()
  expect(response).toEqual(wallet)
})