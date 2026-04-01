import React from 'react';
import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const darkLogoUri = Image.resolveAssetSource(require('../assets/Logo_dark.svg'))?.uri ?? null;
const lightLogoUri = Image.resolveAssetSource(require('../assets/Logo_light.svg'))?.uri ?? null;

export const IrisLogo: React.FC<{ height?: number; width?: number }> = ({ height = 30, width = 100 }) => {
    const { theme } = useTheme();
    const uri = theme === 'dark' ? darkLogoUri : lightLogoUri;

    return <SvgUri uri={uri} width={width} height={height} />;
};
