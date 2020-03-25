import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import { isInstalled, merchantName, isUnlocked } from './../../utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })

  document.dispatchEvent(installEvent)
})

it('Fail connect request due to extension lock', async () => {
  await expect(instance.connectRequest()).rejects.toMatch('Extension locked')
})

it('Fail connect request due to user reject', async () => {
  document.addEventListener(MinterLinkEvent.ConnectRequest, () => {
    const rejectEvent = new CustomEvent(MinterLinkEvent.ConnectReject)

    document.dispatchEvent(rejectEvent)
  })

  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })

  document.dispatchEvent(unlockEvent)

  await expect(instance.connectRequest()).rejects.toMatch('Rejected by user')
})