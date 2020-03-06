declare module 'minter-connect' {
  export default class MinterConnect {
    merchant: Merchant;
    version: string;
    isInstalled: boolean;
    isUnlocked: boolean;
    data: MinterLink;

    constructor(merchant: Merchant);

    listen(): void;
    subscribe(property: string, callback: Function): void;
    paymentRequest(data: TxData): Promise<any>;
  }

  export type MinterLink = {
    version: string
    isInstalled: boolean
    isUnlocked: boolean
  }

  export type Obeservers = {
    [key: string]: Function[]
  }

  export type TxData = {
    address: string
    amount: string
    coin: string
    payload: string
  }

  export enum MinterLinkEvent {
    Version = 'minter:version',
    IsInstalled = 'minter:is_installed',
    IsUnlocked = 'minter:is_unlocked',
    PaymentRequest = 'minter:payment:request',
    PaymentAccept = 'minter:payment:accept',
    PaymentReject = 'minter:payment:reject'
  }

  export type Merchant = {
    name: string;
    url: string;
  }

  export type PaymentRequest = {
    merchant: Merchant;
    data: {
      coin: string;
      amount: string;
      address: string;
      payload: string;
    };
  }
}
