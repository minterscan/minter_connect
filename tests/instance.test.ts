import MinterConnect from '../src/MinterConnect'
import { merchantName } from './utils'


it('Init with undefined Merchant Name', () => {
  const instance = new MinterConnect()

  expect(instance.merchant.name).toEqual('')
})

it('Init with predefined Merchant Name', () => {
  const instance = new MinterConnect(merchantName)

  expect(instance.merchant.name).toEqual(merchantName)
})
