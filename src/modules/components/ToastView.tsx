import {
    Box,
    Column,
    Heading,
    IconButton,
    Row,
    Text
} from "native-base";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { ToastStatus } from "../shared/constants";
import { ColorSettings } from "./Theme/Color";
import Metrics from "./Theme/Metrics";

export interface ToastViewProps {
    title?: string,
    description?: string,
    status: ToastStatus,
    id?: any,
    onPress?: any,
    dismiss?: () => void
}

const ToastColors = {
    info: [ColorSettings.info, ColorSettings.infoBg, "alert-circle"],
    error: [ColorSettings.error, ColorSettings.errorBg, "warning"],
    warning: [ColorSettings.warning, ColorSettings.warningBg, "alert-circle"],
    success: [ColorSettings.success, ColorSettings.successBg, "checkmark-circle-outline"],
    notification: [ColorSettings.info, ColorSettings.white, "alert-circle"]
}

const ToastView = (props: ToastViewProps) => {
    const { title, description, status, onPress, id, dismiss } = props;
    const colors = ToastColors[status];
    const content = (
        <Row space="xs"
            backgroundColor={ColorSettings.white}
            borderRadius={4}
            paddingLeft={3}
            marginBottom={10}
            paddingRight={1}
            paddingY={3}
            width={status === 'notification' ? Metrics.screenMinSize * 0.9 : undefined}
            shadow={1}
            alignItems="center"
            maxWidth={Metrics.screenMinSize * 0.9}
        >
            <Box
                height="40px"
                width="40px"
                borderRadius={20}
                bgColor={colors[1]}
                alignItems="center"
                justifyContent="center">
                <Icon
                    color={colors[0]}
                    size={24}
                    name={colors[2]}
                    style={{
                        marginLeft: 2 //Fix icon bị lệch
                    }}
                />
            </Box>
            <Column space={1}
                flexShrink={1}>
                {title && <Heading size="sm">{title}</Heading>}
                {description && <Text fontSize="sm">{description}</Text>}
            </Column>
            {dismiss && <IconButton variant='ghost'
                _icon={{
                    as: Icon,
                    name: "close",
                    size: 22,
                    color: ColorSettings.gray4
                }}
                _pressed={{
                    backgroundColor: ColorSettings.gray5
                }}
                onPress={() => dismiss()}
            />}
        </Row>
    )
    if (onPress) {
        return (<TouchableOpacity onPress={() => onPress(id)}>
            {content}
        </TouchableOpacity>)
    };
    return content;
};

export default ToastView;