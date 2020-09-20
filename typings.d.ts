declare module 'minter-connect' {
  export default class MinterConnect {
    merchant: Merchant;
    version: string;
    wallet: string;
    isInstalled: boolean;
    isUnlocked: boolean;
    data: MinterLink;

    constructor(merchantName: string);

    listen(): void;
    subscribe(property: string, callback: Function): void;

    signRequest(message: string): Promise<SignResponse>;
    connectRequest(): Promise<string>;
    paymentRequest(data: TxData): Promise<string>;
  }

  export enum ObservableProps {
    IsInstalled = 'isInstalled',
    IsUnlocked = 'isUnlocked',
    Version = 'version',
    Wallet = 'wallet'
  }

  export type MinterLink = {
    [ObservableProps.Version]: string;
    [ObservableProps.Wallet]: string;
    [ObservableProps.IsInstalled]: boolean;
    [ObservableProps.IsUnlocked]: boolean;
  }

  export type Observers = {
    [ObservableProps.IsInstalled]: Function[];
    [ObservableProps.IsUnlocked]: Function[];
    [ObservableProps.Version]: Function[];
    [ObservableProps.Wallet]: Function[];
  }

  export type TxData = {
    address: string;
    amount: string;
    coin: string;
    payload: string;
  }

  export enum MinterLinkEvent {
    Version = 'minter:version',
    IsInstalled = 'minter:is_installed',
    IsUnlocked = 'minter:is_unlocked',
    Wallet = 'minter:wallet',
    ConnectRequest = 'minter:connect:request',
    ConnectAccept = 'minter:connect:accept',
    ConnectReject = 'minter:connect:reject',
    SignRequest = 'minter:sign:request',
    SignAccept = 'minter:sign:accept',
    SignReject = 'minter:sign:reject',
    PaymentRequest = 'minter:payment:request',
    PaymentAccept = 'minter:payment:accept',
    PaymentReject = 'minter:payment:reject'
  }

  export type Merchant = {
    name: string;
    url: string;
  }

  export type ConnectRequest = {
    merchant: Merchant;
  }
  
  export type SignRequest = {
    merchant: Merchant;
    data: {
      message: string;
    };
  }

  export type SignResponse = {
    personalMessage: string;
    signature: string;
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
