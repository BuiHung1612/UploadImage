
const devConfigs = {
    baseURL: "https://hlu.adfilex.vn/business-service/",
    sso: "https://hlu.adfilex.vn/sso"
};

const prodConfigs = {
    baseURL: "https://hluconnect.hlu.edu.vn/business-service/",
    sso: "https://hluconnect.hlu.edu.vn/sso"
};

export let APIConfig = prodConfigs;

export const switchAPI = async (environment: 'test' | 'production', save = false) => {
    console.log("[Auth] switchAPI: " + environment);
    if (environment === 'test') {
        APIConfig = devConfigs;
    }
    else {
        APIConfig = prodConfigs;
    }
    console.log("[Auth] APIConfig: " + JSON.stringify(APIConfig));
    if (save) {
        await LocalStorage.setItem(STORAGE_KEYS.lastEnvironment, environment, StorageType.Normal);
    }
}

export const getCurrentEnvironment = () => {
    const isTest = APIConfig.baseURL === devConfigs.baseURL;
    return isTest ? 'test' : 'production';
}

export const checkIfTestEnvironment = async (apply = false) => {
    const currentEnvironment = getCurrentEnvironment();
    let isTest = currentEnvironment === 'test';
    if (apply) {
        const lastEnv = await LocalStorage.getItem(STORAGE_KEYS.lastEnvironment, StorageType.Normal);
        if (lastEnv != null) {
            if (lastEnv === 'test') {
                APIConfig.baseURL = devConfigs.baseURL;
                APIConfig.sso = devConfigs.sso;
                isTest = true;
            }
            else {
                APIConfig.baseURL = prodConfigs.baseURL;
                APIConfig.sso = prodConfigs.sso;
                isTest = false;
            }
        }
        else {
            await LocalStorage.setItem(STORAGE_KEYS.lastEnvironment, currentEnvironment, StorageType.Normal);
        }
    }
    return isTest;
}
import LocalStorage, { StorageType } from "../locaStorage/LocaStorage";
import { STORAGE_KEYS } from "../shared/constants";
// import { STORAGE_KEYS } from "../shared/constants";
// import LocalStorage, { StorageType } from "../utils/LocalStorage";

const devConfigs = {
    baseURL: "https://hlu.adfilex.vn/business-service/",
    sso: "https://hlu.adfilex.vn/sso"
};

const prodConfigs = {
    baseURL: "https://hluconnect.hlu.edu.vn/business-service/",
    sso: "https://hluconnect.hlu.edu.vn/sso"
};

export let APIConfig = prodConfigs;

export const switchAPI = async (environment: 'test' | 'production', save = false) => {
    console.log("[Auth] switchAPI: " + environment);
    if (environment === 'test') {
        APIConfig = devConfigs;
    }
    else {
        APIConfig = prodConfigs;
    }
    console.log("[Auth] APIConfig: " + JSON.stringify(APIConfig));
    if (save) {
        await LocalStorage.setItem(STORAGE_KEYS.lastEnvironment, environment, StorageType.Normal);
    }
}

export const getCurrentEnvironment = () => {
    const isTest = APIConfig.baseURL === devConfigs.baseURL;
    return isTest ? 'test' : 'production';
}

export const checkIfTestEnvironment = async (apply = false) => {
    const currentEnvironment = getCurrentEnvironment();
    let isTest = currentEnvironment === 'test';
    if (apply) {
        const lastEnv = await LocalStorage.getItem(STORAGE_KEYS.lastEnvironment, StorageType.Normal);
        if (lastEnv != null) {
            if (lastEnv === 'test') {
                APIConfig.baseURL = devConfigs.baseURL;
                APIConfig.sso = devConfigs.sso;
                isTest = true;
            }
            else {
                APIConfig.baseURL = prodConfigs.baseURL;
                APIConfig.sso = prodConfigs.sso;
                isTest = false;
            }
        }
        else {
            await LocalStorage.setItem(STORAGE_KEYS.lastEnvironment, currentEnvironment, StorageType.Normal);
        }
    }
    return isTest;
}