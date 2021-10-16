import AsyncStorage from '@react-native-async-storage/async-storage';
import deviceInfoModule from 'react-native-device-info';
import SInfo, { RNSensitiveInfoOptions } from "react-native-sensitive-info";

const bundleId = deviceInfoModule.getBundleId().replace('.', '_') + '_';
const defaultOptions: RNSensitiveInfoOptions = {
    sharedPreferencesName: bundleId + 'shared_prefs',
    keychainService: bundleId + 'key_chain'
}

// import deviceInfoModule from 'react-native-device-info';

// const bundleId = deviceInfoModule.getBundleId().replace('.','_') + '_';
/**
 * Types of storage in device
 *
 * Simple: Use SharedPreferences (Android) and UserDefaults (iOS)
 * Normal: Save to files
 * Secure: Use SharedPreferences (Android) and Keychain (iOS)
 */
export enum StorageType {
    Normal,
    Secure,
}

/**
 * Save item to local storage
 * @param key string
 * @param value string or serializable object
 * @param storageType
 * @returns null if successful, error message or error object if failed
 */
const setItem = async (key: string, value: any, storageType: StorageType) => {
    if (key == null || key.length === 0) {
        return "Storage key must not be empty";
    }
    if (value == null) {
        return "Storage value must not be null";
    };
    let valueStr = "";
    if (typeof value === 'string') {
        valueStr = value;
    }
    else {
        valueStr = JSON.stringify(value);
    }
    switch (storageType) {
        case StorageType.Normal:
            try {
                await AsyncStorage.setItem(key, valueStr)
                return null;
            } catch (error) {
                return error;
            }
        case StorageType.Secure:
            await SInfo.setItem(key, value, defaultOptions);
            return null;
        default:
            return "Unsupported storage type";
    }
}


/**
 * Save multiple items  to local storage
 * @param keyValuePairs array of pairs [[key,value]]
 * @param storageType
 * @returns null if successful, error message or error object if failed
 */
const setItems = async (keyValuePairs: string[][], storageType: StorageType) => {
    if (keyValuePairs == null || keyValuePairs.length === 0) {
        return "Storage key must not be empty";
    }

    switch (storageType) {
        case StorageType.Normal:
            try {
                await AsyncStorage.multiSet(keyValuePairs)
                return null;
            } catch (error) {
                return error;
            }
        case StorageType.Secure:
            await Promise.all(keyValuePairs.map((pair) => SInfo.setItem(pair[0], pair[1], defaultOptions)));
            return null;
        default:
            return "Unsupported storage type";
    }
}

/**
 * Get saved item
 * @param key string
 * @param storageType
 * @returns null if not saved, otherwise returns a string
 */
const getItem = async (key: string, storageType: StorageType) => {
    if (key == null || key.length === 0) {
        return null;
    }
    switch (storageType) {
        case StorageType.Normal:
            try {
                return await AsyncStorage.getItem(key)
            } catch (e) {
                console.log("[LocalStorage][ERROR] " + e);
                return null;
            }
        case StorageType.Secure:

            return await SInfo.getItem(key, defaultOptions);
        default:
            return null;
    }
}

/**
 * Get multiple items  to local storage
 * @param keys array of keys
 * @param storageType
 * @returns key - value pairs
 */
const getItems = async (keys: string[], storageType: StorageType): Promise<Record<string, string | null>> => {
    if (keys == null || keys.length === 0) {
        return {};
    }
    switch (storageType) {
        case StorageType.Normal:
            try {
                const values = await AsyncStorage.multiGet(keys);
                const output: Record<string, string | null> = {}
                values.forEach((pair) => {
                    output[pair[0]] = pair[1];
                });
                return output;
            } catch (e) {
                console.log("[LocalStorage][ERROR] " + e);
                return {};
            }
        case StorageType.Secure:
            const output: Record<string, string | null> = {}
            await Promise.all(keys.map((k) => {
                return SInfo.getItem(k, defaultOptions)
                    .then((value) => {
                        output[k] = value
                    })
                    .catch((error) => {
                        console.log("[LocalStorage][ERROR] " + error);
                    });
            }));
            return output;
        default:
            return {};
    }
}

const deleteItem = async (key: string, storageType: StorageType) => {
    if (key == null || key.length === 0) {
        return;
    }
    switch (storageType) {
        case StorageType.Normal:
            try {
                await AsyncStorage.removeItem(key)
            } catch (e) {
                console.log("[LocalStorage][ERROR] " + e);
            }
            break;
        case StorageType.Secure:
            await SInfo.deleteItem(key, defaultOptions);
            break;
        default:
            break;
    }
}

const deleteItems = async (keys: string[], storageType: StorageType) => {
    if (keys == null || keys.length === 0) {
        return;
    }
    switch (storageType) {
        case StorageType.Normal:
            try {
                await AsyncStorage.multiRemove(keys)
            } catch (e) {
                console.log("[LocalStorage][ERROR] " + e);
            }
            break;
        case StorageType.Secure:
            await Promise.all(keys.map((k) => SInfo.deleteItem(k, defaultOptions)));
            break;
        default:
            break;
    }
}

export default {
    setItem,
    setItems,
    getItems,
    getItem,
    deleteItem,
    deleteItems
}