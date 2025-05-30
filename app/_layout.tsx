import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { DatabaseConnectionProvider } from '@/database/DatabaseConnection';
import React from 'react';
import Logo from '@/components/Logo';
import { LogBox } from 'react-native';
import { THEME } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  LogBox.ignoreAllLogs();

  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const HeaderRightLogo = () => <Logo style={styles.logoContainer} imageStyle={styles.logoImage} />;

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <DatabaseConnectionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: THEME.COLORS.PRIMARY as string },
            headerTitle: '',
            headerRight: HeaderRightLogo,
          }}>
          <Stack.Screen name="(tabs)" options={{}} />
          <Stack.Screen name="description-screen" options={{}} />
          <Stack.Screen name="camera" options={{}} />
          <Stack.Screen name="user-register" options={{}} />
          <Stack.Screen name="login" options={{}} />
          <Stack.Screen name="modal" options={{ presentation: 'containedTransparentModal' }} />
        </Stack>
      </ThemeProvider>
    </DatabaseConnectionProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: 'transparent',
    height: '250%',
    width: '100%',
  },
  logoImage: {
    height: '90%',
    left: '45%',
    paddingVertical: THEME.SPACING.PADDING.VERTICAL,
    resizeMode: 'contain',
    top: 0,
    width: '100%',
  },
});
