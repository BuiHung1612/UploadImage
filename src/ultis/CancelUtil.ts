import axios, { CancelTokenSource } from "axios";

const cancelTS = new Map<string, CancelTokenSource>();

export const createCancelTokenSource = (key: string) => {
    if (cancelTS.has(key)) {
        cancelTS.get(key)?.cancel();
    }
    const cts = axios.CancelToken.source();
    cancelTS.set(key, cts);
    return cts.token;
}
export const cancel = (key: string) => {
    if (cancelTS.has(key)) {
        cancelTS.get(key)?.cancel();
        cancelTS.delete(key);
    }
}

export const removeCancelTokenSource = (key: string) => {
    if (cancelTS.has(key)) {
        cancelTS.delete(key);
    }
}

export const cancelAll = (prefix: string | null = null) => {
    if (prefix) {
        const keys = Array.from(cancelTS.keys())
            .filter((k) => k.startsWith(prefix));
        keys.forEach((k) => {
            cancelTS.get(k)?.cancel();
            cancelTS.delete(k);
        })
    } else {
        cancelTS.forEach((cts) => {
            cts.cancel();
        });
        cancelTS.clear();
    }
}