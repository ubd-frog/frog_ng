import { Injectable } from '@angular/core';


@Injectable()
export class StorageService {
    private storage: Storage;
    private session: Storage;

    constructor() {
        this.storage = window.localStorage;
        this.session = window.sessionStorage;
    }
    get(key: string, defaultvalue: any = null) {
        try {
            let result = this.storage.getItem(key);
            if (result === null) {
                return defaultvalue;
            }
            return JSON.parse(result);
        }
        catch (e) {
            return defaultvalue;
        }
    }
    set(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }
    pop(key: string) {
        let result = this.get(key);
        this.storage.removeItem(key);

        return result;
    }

    sessionGet(key: string, defaultvalue: any = null) {
        try {
            let result = this.session.getItem(key);
            if (result === null) {
                return defaultvalue;
            }
            return JSON.parse(result);
        }
        catch (e) {
            return defaultvalue;
        }
    }
    sessionSet(key: string, value: any) {
        this.session.setItem(key, JSON.stringify(value));
    }
}
