import { MinterLinkEvent, ObservableProps } from './model';
const MERCHANT = {
    name: '',
    url: '',
};
export default class MinterConnect {
    constructor(merchantName) {
        this._merchant = MERCHANT;
        this._version = '';
        this._wallet = '';
        this._isInstalled = false;
        this._isUnlocked = false;
        this._observers = {
            version: [],
            wallet: [],
            isInstalled: [],
            isUnlocked: []
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
        this.notifySubscribers(ObservableProps.Version, value);
    }
    setIsInstalled(value) {
        this._isInstalled = value;
        this.notifySubscribers(ObservableProps.IsInstalled, value);
    }
    setIsUnlocked(value) {
        this._isUnlocked = value;
        this.notifySubscribers(ObservableProps.IsUnlocked, value);
    }
    setWallet(value) {
        this._wallet = value;
        this.notifySubscribers(ObservableProps.Wallet, value);
    }
    /**
     * Send conect request to content script (reveal active wallet address)
     */
    connectRequest() {
        return new Promise((resolve, reject) => {
            const detail = {
                merchant: this.merchant
            };
            document.addEventListener(MinterLinkEvent.ConnectAccept, event => {
                resolve(event.detail);
            });
            document.addEventListener(MinterLinkEvent.ConnectReject, event => {
                reject(event);
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
            document.addEventListener(MinterLinkEvent.SignReject, event => {
                reject(event);
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
        return new Promise((resolve, reject) => {
            const detail = {
                merchant: this.merchant,
                data
            };
            document.addEventListener(MinterLinkEvent.PaymentAccept, event => {
                resolve(event);
            });
            document.addEventListener(MinterLinkEvent.PaymentReject, event => {
                reject(event);
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