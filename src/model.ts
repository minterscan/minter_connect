export enum MinterLinkObservableProps {
  IsInstalled = 'isInstalled',
  IsUnlocked = 'isUnlocked',
  Version = 'version',
  Wallet = 'wallet'
}

export type MinterLink = {
  [MinterLinkObservableProps.Version]: string;
  [MinterLinkObservableProps.Wallet]: string;
  [MinterLinkObservableProps.IsInstalled]: boolean;
  [MinterLinkObservableProps.IsUnlocked]: boolean;
}

export type MinterLinkObservers = {
  [MinterLinkObservableProps.IsInstalled]: Function[];
  [MinterLinkObservableProps.IsUnlocked]: Function[];
  [MinterLinkObservableProps.Version]: Function[];
  [MinterLinkObservableProps.Wallet]: Function[];
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
