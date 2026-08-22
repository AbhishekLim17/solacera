import { useWindowDimensions } from 'react-native';

export const BP = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < BP.tablet,
    isTablet: width >= BP.tablet && width < BP.desktop,
    isDesktop: width >= BP.desktop,
    r: function<T>(mobile: T, tablet: T, desktop: T): T {
      return width >= BP.desktop ? desktop : width >= BP.tablet ? tablet : mobile;
    },
  };
}