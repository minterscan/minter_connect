import MinterConnect from '../../../src/MinterConnect'
import { MinterLinkEvent } from '../../../src/model'
import { isInstalled, merchantName, isUnlocked, wallet } from './../../utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })

  document.dispatchEvent(installEvent)
})

it('Fail sign request due to extension lock', async () => {
  await expect(instance.signRequest('')).rejects.toMatch('Extension locked')
})

it('Fail sign request due to wallet empty', async () => {
  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })
  document.dispatchEvent(unlockEvent)

  await expect(instance.signRequest('')).rejects.toMatch('Wallet is empty')
})

it('Fail sign request due to user reject', async () => {
  const walletEvent = new CustomEvent(MinterLinkEvent.Wallet, { detail: wallet })
  document.dispatchEvent(walletEvent)

  document.addEventListener(MinterLinkEvent.SignRequest, () => {
    const rejectEvent = new CustomEvent(MinterLinkEvent.SignReject)

    document.dispatchEvent(rejectEvent)
  })

  await expect(instance.signRequest('')).rejects.toMatch('Rejected by user')
})