export var MinterLinkEvent;
(function (MinterLinkEvent) {
    MinterLinkEvent["Version"] = "minter:version";
    MinterLinkEvent["IsInstalled"] = "minter:is_installed";
    MinterLinkEvent["IsUnlocked"] = "minter:is_unlocked";
    MinterLinkEvent["PaymentRequest"] = "minter:payment:request";
    MinterLinkEvent["PaymentAccept"] = "minter:payment:accept";
    MinterLinkEvent["PaymentReject"] = "minter:payment:reject";
})(MinterLinkEvent || (MinterLinkEvent = {}));
const MERCHANT = {
    name: '',
    url: ''
};
export default class MinterConnect {
    constructor(merchant) {
        this._merchant = MERCHANT;
        this._version = '';
        this._isInstalled = false;
        this._isUnlocked = false;
        this._observers = {
            version: [],
            isInstalled: [],
            isUnlocked: []
        };
        this.listen();
        this.setMerchant(merchant);
    }
    get merchant() {
        return this._merchant;
    }
    get version() {
        return this._version;
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
            isInstalled: this.isInstalled,
            isUnlocked: this.isUnlocked
        };
    }
    /**
     * Listen events from content script
     */
    listen() {
        const _this = this;
        document.addEventListener(MinterLinkEvent.IsInstalled, (event) => {
            const e = event;
            _this.setIsInstalled(e.detail);
        });
        document.addEventListener(MinterLinkEvent.IsUnlocked, (event) => {
            const e = event;
            _this.setIsUnlocked(e.detail);
        });
        document.addEventListener(MinterLinkEvent.Version, (event) => {
            const e = event;
            _this.setVersion(e.detail);
        });
    }
    setMerchant(value) {
        this._merchant = value;
    }
    setVersion(value) {
        this._version = value;
        this.notifySubscribers('version', value);
    }
    setIsInstalled(value) {
        this._isInstalled = value;
        this.notifySubscribers('isInstalled', value);
    }
    setIsUnlocked(value) {
        this._isUnlocked = value;
        this.notifySubscribers('isUnlocked', value);
    }
    /**
     * Send payment request to content script and wait for response
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