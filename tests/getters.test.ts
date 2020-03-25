import MinterConnect from '../src/MinterConnect'
import { MinterLinkEvent, ObservableProps } from '../src/model'
import {
  isInstalled,
  isUnlocked,
  version,
  wallet,
  merchantName
} from './utils'

let instance!: MinterConnect

beforeAll(() => {
  instance = new MinterConnect(merchantName)
})


it('Set Extension installed', () => {
  instance.subscribe(ObservableProps.IsInstalled, (value: boolean) => {
    expect(value).toEqual(isInstalled)
    expect(instance.isInstalled).toEqual(isInstalled)
  })

  const installEvent = new CustomEvent(MinterLinkEvent.IsInstalled, { detail: isInstalled })
  document.dispatchEvent(installEvent)
})

it('Set Extension version', () => {
  instance.subscribe(ObservableProps.Version, (value: string) => {
    expect(value).toEqual(version)
    expect(instance.version).toEqual(version)
  })

  const versionEvent = new CustomEvent(MinterLinkEvent.Version, { detail: version })
  document.dispatchEvent(versionEvent)
})

it('Set Extension unlocked', () => {
  instance.subscribe(ObservableProps.IsUnlocked, (value: boolean) => {
    expect(value).toEqual(isUnlocked)
    expect(instance.isUnlocked).toEqual(isUnlocked)
  })

  const unlockEvent = new CustomEvent(MinterLinkEvent.IsUnlocked, { detail: isUnlocked })
  document.dispatchEvent(unlockEvent)    
})

it('Set Extension active wallet', () => {
  instance.subscribe(ObservableProps.Wallet, (value: string) => {
    expect(value).toEqual(wallet)
    expect(instance.wallet).toEqual(wallet)
  })

  const walletEvent = new CustomEvent(MinterLinkEvent.Wallet, { detail: wallet })
  document.dispatchEvent(walletEvent)
})

it('Notify subscriber', () => {
  const callback = jest.fn()

  instance.subscribe(ObservableProps.Wallet, callback)

  const walletEvent = new CustomEvent(MinterLinkEvent.Wallet, { detail: wallet })
  document.dispatchEvent(walletEvent)    
  
  expect(callback).toHaveBeenCalled()
})

it('Return data object', () => {
  expect(instance.data.isInstalled).toEqual(isInstalled)
  expect(instance.data.isUnlocked).toEqual(isUnlocked)
  expect(instance.data.version).toEqual(version)
  expect(instance.data.wallet).toEqual(wallet)
})