import { Toast as NBToast } from "native-base";
import * as React from 'react';
import { Platform } from "react-native";
import { Dispatch } from "redux";
import { MESSAGES, ToastStatus } from '../../shared/constants';
import ToastView from '../ToastView';

let lastShow401: number | null = null;

export const getErrorMessage = (message: string | null) => {
    if (message === "authenticate.authenHeaderRequired") {
        return MESSAGES.sessionExpire;
    }
    if (message != null && message.toLowerCase().includes("timeout")) {
        return MESSAGES.timeoutError
    }
    return message ?? MESSAGES.unknownError;
}

export const showErrorMessage = (message: string | null) => {
    showToast({
        status: "error",
        description: getErrorMessage(message)
    });
};

export interface ToastProps {
    title?: string,
    description?: string,
    status: ToastStatus,
    onPress?: any
}

export const showToast = (props: ToastProps) => {
    const status = props.status ?? "info";
    let description = props.description ?? " ";
    if (Platform.OS === 'ios') { //Fix description is cut off on ios
        description = description + "        \n";
    }
    NBToast.show({
        placement: status === 'notification' ? 'top' : 'bottom',
        render: ({ id, onClose }) => {
            return (
                <ToastView
                    id={id}
                    title={props.title}
                    description={props.description}
                    status={status}
                    onPress={props.onPress}
                    dismiss={() => {
                        NBToast.close(id);
                    }}
                />
            )
        },
    })
}