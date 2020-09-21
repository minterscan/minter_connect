import { MinterLinkEvent, MinterLinkObservableProps } from './model';
const MERCHANT = {
    name: '',
    url: '',
};
export default class MinterConnect {
    constructor(merchantName = '') {
        this._merchant = MERCHANT;
        this._version = '';
        this._wallet = '';
        this._isInstalled = false;
        this._isUnlocked = false;
        this._observers = {
            [MinterLinkObservableProps.Version]: [],
            [MinterLinkObservableProps.Wallet]: [],
            [MinterLinkObservableProps.IsInstalled]: [],
            [MinterLinkObservableProps.IsUnlocked]: []
        };
        this.listen();
        this.setMerchantName(merchantName);
    }
    get merchant() {
        return this._merchant;
    }
    get version() {
        return this._version;
    }
    get wallet() {
        return this._wallet;
    }
    get isInstalled() {
        return this._isInstalled;
    }
    get isUnlocked() {
        return this._isUnlocked;
    }
    get data() {
        return {
            version: this.version,
            wallet: this.wallet,
            isInstalled: this.isInstalled,
            isUnlocked: this.isUnlocked
        };
    }
    /**
     * Listen events from content script
     */
    listen() {
        document.addEventListener(MinterLinkEvent.IsInstalled, (event) => {
            this.setIsInstalled(event.detail);
        });
        document.addEventListener(MinterLinkEvent.IsUnlocked, (event) => {
            this.setIsUnlocked(event.detail);
        });
        document.addEventListener(MinterLinkEvent.Version, (event) => {
            this.setVersion(event.detail);
        });
        document.addEventListener(MinterLinkEvent.Wallet, (event) => {
            this.setWallet(event.detail);
        });
    }
    setMerchantName(value) {
        this._merchant.name = value;
    }
    setVersion(value) {
        this._version = value;
        this.notifySubscribers(MinterLinkObservableProps.Version, value);
    }
    setIsInstalled(value) {
        this._isInstalled = value;
        this.notifySubscribers(MinterLinkObservableProps.IsInstalled, value);
    }
    setIsUnlocked(value) {
        this._isUnlocked = value;
        this.notifySubscribers(MinterLinkObservableProps.IsUnlocked, value);
    }
    setWallet(value) {
        this._wallet = value;
        this.notifySubscribers(MinterLinkObservableProps.Wallet, value);
    }
    /**
     * Send connect request to content script (reveal active wallet address)
     */
    connectRequest() {
        if (!this.isUnlocked)
            return Promise.reject('Extension locked');
        return new Promise((resolve, reject) => {
            const detail = {
                merchant: this.merchant
            };
            document.addEventListener(MinterLinkEvent.ConnectAccept, event => {
                return resolve(event.detail);
            });
            document.addEventListener(MinterLinkEvent.ConnectReject, () => {
                return reject('Rejected by user');
            });
            const event = new CustomEvent(MinterLinkEvent.ConnectRequest, { detail });
            document.dispatchEvent(event);
        });
    }
    /**
     * Send sign request (auth) to content script
     *
     * @param message
     */
    signRequest(message) {
        if (!this.isUnlocked)
            return Promise.reject('Extension locked');
        if (!this.wallet)
            return Promise.reject('Wallet is empty');
        return new Promise((resolve, reject) => {
            const detail = {
                merchant: this.merchant,
                data: {
                    message
                }
            };
            document.addEventListener(MinterLinkEvent.SignAccept, event => {
                resolve(event.detail);
            });
            document.addEventListener(MinterLinkEvent.SignReject, () => {
                return reject('Rejected by user');
            });
            const event = new CustomEvent(MinterLinkEvent.SignRequest, { detail });
            document.dispatchEvent(event);
        });
    }
    /**
     * Send payment request to content script
     *
     * @param data
     */
    paymentRequest(data) {
        if (!this.isUnlocked)
            return Promise.reject('Extension locked');
        return new Promise((resolve, reject) => {
            const detail = {
                merchant: this.merchant,
                data
            };
            document.addEventListener(MinterLinkEvent.PaymentAccept, event => {
                resolve(event.detail);
            });
            document.addEventListener(MinterLinkEvent.PaymentReject, () => {
                return reject('Rejected by user');
            });
            const event = new CustomEvent(MinterLinkEvent.PaymentRequest, { detail });
            document.dispatchEvent(event);
        });
    }
    /**
     * Subscribe observers
     *
     * @param property
     * @param callback
     */
    subscribe(property, callback) {
        this._observers[property].push(callback);
    }
    /**
     * Notify observers about Minter Link updates
     *
     * @param property
     * @param value
     */
    notifySubscribers(property, value) {
        for (let i = 0; i < this._observers[property].length; i++) {
            this._observers[property][i](value);
        }
    }
}
//# sourceMappingURL=MinterConnect.js.map