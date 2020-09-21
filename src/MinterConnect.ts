import {
  MinterLink,
  MinterLinkEvent,
  Merchant,
  MinterLinkObservers,
  TxData,
  SignRequest,
  PaymentRequest,
  MinterLinkObservableProps,
  SignResponse
} from './model'

const MERCHANT = {
  name: '',
  url: '',
}

export default class MinterConnect {
  private _merchant: Merchant = MERCHANT
  private _version = ''
  private _wallet = ''
  private _isInstalled = false
  private _isUnlocked = false
  private _observers: MinterLinkObservers = {
    [MinterLinkObservableProps.Version]: [],
    [MinterLinkObservableProps.Wallet]: [],
    [MinterLinkObservableProps.IsInstalled]: [],
    [MinterLinkObservableProps.IsUnlocked]: []
  }

  constructor(merchantName = '') {
    this.listen()
    this.setMerchantName(merchantName)
  }

  get merchant(): Merchant {
    return this._merchant
  }

  get version(): string {
    return this._version
  }

  get wallet(): string {
    return this._wallet
  }

  get isInstalled(): boolean {
    return this._isInstalled
  }

  get isUnlocked(): boolean {
    return this._isUnlocked
  }

  get data(): MinterLink {
    return {
      version: this.version,
      wallet: this.wallet,
      isInstalled: this.isInstalled,
      isUnlocked: this.isUnlocked
    }
  }

  /**
   * Listen events from content script
   */
  public listen(): void {
    document.addEventListener(MinterLinkEvent.IsInstalled, (event: Event) => {
      this.setIsInstalled((event as CustomEvent).detail)
    })

    document.addEventListener(MinterLinkEvent.IsUnlocked, (event: Event) => {
      this.setIsUnlocked((event as CustomEvent).detail)
    })

    document.addEventListener(MinterLinkEvent.Version, (event: Event) => {
      this.setVersion((event as CustomEvent).detail)
    })

    document.addEventListener(MinterLinkEvent.Wallet, (event: Event) => {
      this.setWallet((event as CustomEvent).detail)
    })
  }

  private setMerchantName(value: string): void {
    this._merchant.name = value
  }

  private setVersion(value: string): void {
    this._version = value

    this.notifySubscribers(MinterLinkObservableProps.Version, value)
  }

  private setIsInstalled(value: boolean): void {
    this._isInstalled = value

    this.notifySubscribers(MinterLinkObservableProps.IsInstalled, value)
  }

  private setIsUnlocked(value: boolean): void {
    this._isUnlocked = value

    this.notifySubscribers(MinterLinkObservableProps.IsUnlocked, value)
  }

  private setWallet(value: string): void {
    this._wallet = value

    this.notifySubscribers(MinterLinkObservableProps.Wallet, value)
  }

  /**
   * Send connect request to content script (reveal active wallet address)
   */
  public connectRequest(): Promise<string> {
    if (!this.isUnlocked) return Promise.reject('Extension locked')

    return new Promise((resolve, reject) => {
      const detail = {
        merchant: this.merchant
      }

      document.addEventListener(MinterLinkEvent.ConnectAccept, event => {
        return resolve((event as CustomEvent).detail)
      })

      document.addEventListener(MinterLinkEvent.ConnectReject, () => {
        return reject('Rejected by user')
      })

      const event = new CustomEvent(MinterLinkEvent.ConnectRequest, { detail })

      document.dispatchEvent(event)
    })
  }

  /**
   * Send sign request (auth) to content script
   *
   * @param message
   */
  public signRequest(message: string): Promise<SignResponse> {
    if (!this.isUnlocked) return Promise.reject('Extension locked')
    if (!this.wallet) return Promise.reject('Wallet is empty')

    return new Promise((resolve, reject) => {
      const detail: SignRequest = {
        merchant: this.merchant,
        data: {
          message
        }
      }

      document.addEventListener(MinterLinkEvent.SignAccept, event => {
        resolve((event as CustomEvent).detail)
      })

      document.addEventListener(MinterLinkEvent.SignReject, () => {
        return reject('Rejected by user')
      })

      const event = new CustomEvent(MinterLinkEvent.SignRequest, { detail })

      document.dispatchEvent(event)
    })
  }

  /**
   * Send payment request to content script
   * 
   * @param data 
   */
  public paymentRequest(data: TxData): Promise<string> {
    if (!this.isUnlocked) return Promise.reject('Extension locked')

    return new Promise((resolve, reject) => {
      const detail: PaymentRequest = {
        merchant: this.merchant,
        data
      }

      document.addEventListener(MinterLinkEvent.PaymentAccept, event => {
        resolve((event as CustomEvent).detail)
      })

      document.addEventListener(MinterLinkEvent.PaymentReject, () => {
        return reject('Rejected by user')
      })

      const event = new CustomEvent(MinterLinkEvent.PaymentRequest, { detail })

      document.dispatchEvent(event)
    })
  }

  /**
   * Subscribe observers
   * 
   * @param property 
   * @param callback 
   */
  public subscribe(property: keyof MinterLink, callback: Function): void {
    this._observers[property].push(callback)
  }

  /**
   * Notify observers about Minter Link updates
   * 
   * @param property 
   * @param value 
   */
  private notifySubscribers(property: keyof MinterLink, value: boolean|string): void {
    for (let i = 0; i < this._observers[property].length; i++) {
      this._observers[property][i](value)
    }
  }
}
