const { Dimensions } = require("react-native");
const screen = Dimensions.get('screen');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const screenMinSize = Math.min(screen.width, screen.height);
const screenMaxSize = Math.max(screen.width, screen.height);

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

const horizontalScreenRatio = screenMinSize / DESIGN_WIDTH;
const verticalScreenRatio = screenMaxSize / DESIGN_HEIGHT;

const Metrics = {
    screenMinSize,
    screenMaxSize,
    windowWidth: Math.round(windowWidth),
    windowHeight: Math.round(windowHeight),
    designWidth: DESIGN_WIDTH,
    designHeight: DESIGN_HEIGHT,
    modalDeviceWidth: Number.MAX_VALUE,
    modalDeviceHeight: Number.MAX_VALUE,
    horizontalScreenRatio,
    verticalScreenRatio,
    navigationButtonSize: 36,
    screenDesignRatio: Math.max(horizontalScreenRatio, verticalScreenRatio),
    calloutWidth: 300,
    navigationIconSize: 24,
    screenTitleSize: 20, // xl in Native Base,
    screenHorizontalInset: 20,
    screenVerticalInset: 20,
    normalButtonHeight: 48,
    normalButtonFontSize: 16,
    smallButtonHeight: 36,
    smallButtonFontSize: 14,
    mediumButtonHeight: 56,
    mediumButtonFontSize: 18,
    largeButtonHeight: 62,
    largeButtonFontSize: 20
};

export default Metrics;