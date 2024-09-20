class LocalStorageUtil {
    private storage: Storage;

    constructor() {
        this.storage = window.localStorage;
        // this.expired = 1000 * 60;
    }

    /**
     * 设置带过期时间的LocalStorage
     * @param key
     * @param value
     * @param expired in ms
     * @returns {Object}
     */
    set(key, value, expired) {
        const tempObj = {};
        tempObj.key = key;
        tempObj.value = value;
        if (expired) {
            tempObj.expired = Date.now() + expired;
        } else {
            tempObj.expired = 0;
        }
        this.storage[key] = JSON.stringify(tempObj);
        return tempObj;
    }

    /***
     * 获取带过期时间的 storage
     * @param key
     * @returns {null|*}
     */
    get(key) {
        try {
            const storageData = this.storage.getItem(key);
            console.log('storageData: ', storageData);
            if (!storageData) {
                return null;
            }
            const tempObj = JSON.parse(storageData);
            const expired = tempObj.expired || 0;
            console.log(expired);
            if (expired && Date.now() > expired) {
                this.remove(key);
                return null;
            }
            return tempObj.value;
        } catch (e) {
            console.log('e: ', e);
            return null;
        }
    }

    remove(key) {
        this.storage.removeItem(key);
    }
}
const localStorageUtil = new LocalStorageUtil();

export default localStorageUtil;

