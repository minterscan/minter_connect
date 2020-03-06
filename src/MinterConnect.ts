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

const MERCHANT = {
  name: '',
  url: ''
}

export default class MinterConnect {
  _merchant: Merchant = MERCHANT
  _version = ''
  _isInstalled = false
  _isUnlocked = false
  _observers: Obeservers = {
    version: [],
    isInstalled: [],
    isUnlocked: []
  }

  constructor(merchant: Merchant) {
    this.listen()
    this.setMerchant(merchant)
  }

  get merchant(): Merchant {
    return this._merchant
  }

  get version(): string {
    return this._version
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
      isInstalled: this.isInstalled,
      isUnlocked: this.isUnlocked
    }
  }

  /**
   * Listen events from content script
   */
  public listen(): void {
    const _this = this

    document.addEventListener(MinterLinkEvent.IsInstalled, (event: Event) => {
      const e = event as CustomEvent

      _this.setIsInstalled(e.detail)
    })

    document.addEventListener(MinterLinkEvent.IsUnlocked, (event: Event) => {
      const e = event as CustomEvent

      _this.setIsUnlocked(e.detail)
    })

    document.addEventListener(MinterLinkEvent.Version, (event: Event) => {
      const e = event as CustomEvent

      _this.setVersion(e.detail)
    })
  }

  private setMerchant(value: Merchant): void {
    this._merchant = value
  }

  private setVersion(value: string): void {
    this._version = value

    this.notifySubscribers('version', value)
  }

  private setIsInstalled(value: boolean): void {
    this._isInstalled = value

    this.notifySubscribers('isInstalled', value)
  }

  private setIsUnlocked(value: boolean): void {
    this._isUnlocked = value

    this.notifySubscribers('isUnlocked', value)
  }

  /**
   * Send payment request to content script and wait for response
   * 
   * @param data 
   */
  public paymentRequest(data: TxData): Promise<any> {
    return new Promise((resolve, reject) => {
      const detail = {
        merchant: this.merchant,
        data
      }

      document.addEventListener(MinterLinkEvent.PaymentAccept, event => {
        resolve(event)
      })

      document.addEventListener(MinterLinkEvent.PaymentReject, event => {
        reject(event)
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
  subscribe(property: string, callback: Function): void {
    this._observers[property].push(callback)
  }

  /**
   * Notify observers about Minter Link updates
   * 
   * @param property 
   * @param value 
   */
  notifySubscribers(property: string, value: any): void {
    for (let i = 0; i < this._observers[property].length; i++) {
      this._observers[property][i](value)
    }
  }
}
