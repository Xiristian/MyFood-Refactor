import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import LoginPage from '../login';
import { Pressable, View, StyleSheet, PressableProps, GestureResponderEvent } from 'react-native';

// Types
type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type EntypoIconName = keyof typeof Entypo.glyphMap;
type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;

interface CustomTabBarButtonProps extends PressableProps {
  children: React.ReactNode;
  setSelectedTab: (name: string) => void;
  selectedTab: string;
  name: string;
}

// Constants
const THEME = {
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    BACKGROUND: '#FFFCEB',
  },
  ICON: {
    SIZE: {
      MEALS: 40,
      GRAPHICS: 30,
      USER: 30,
    },
    COLOR: '#FFFFFF',
  },
};

const TAB_CONFIG = {
  MEALS: {
    name: 'meals',
    icon: 'carrot' as MaterialCommunityIconName,
    size: THEME.ICON.SIZE.MEALS,
  },
  GRAPHICS: {
    name: 'graphics',
    icon: 'bar-graph' as EntypoIconName,
    size: THEME.ICON.SIZE.GRAPHICS,
  },
  USER: {
    name: 'user',
    icon: 'user' as FontAwesomeIconName,
    size: THEME.ICON.SIZE.USER,
  },
};

// Components
const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({
  children,
  setSelectedTab,
  selectedTab,
  name,
  ...props
}) => {
  const handlePress = (e: GestureResponderEvent) => {
    setSelectedTab(name);
    if (props.onPress) props.onPress(e);
  };

  return (
    <Pressable {...props} style={styles.button} onPress={handlePress}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: selectedTab === name ? THEME.COLORS.PRIMARY : THEME.COLORS.SECONDARY,
          },
        ]}>
        {children}
      </View>
    </Pressable>
  );
};

const TabNavigator: React.FC<{
  selectedTab: string;
  setSelectedTab: (name: string) => void;
}> = ({ selectedTab, setSelectedTab }) => (
  <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: styles.tabBar,
    }}>
    <Tabs.Screen
      name="index"
      options={{
        tabBarButton: (props) => (
          <CustomTabBarButton
            {...props}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            name={TAB_CONFIG.MEALS.name}>
            <MaterialCommunityIcons
              name={TAB_CONFIG.MEALS.icon}
              size={TAB_CONFIG.MEALS.size}
              color={THEME.ICON.COLOR}
            />
          </CustomTabBarButton>
        ),
      }}
    />
    <Tabs.Screen
      name="graphics"
      options={{
        tabBarButton: (props) => (
          <CustomTabBarButton
            {...props}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            name={TAB_CONFIG.GRAPHICS.name}>
            <Entypo
              name={TAB_CONFIG.GRAPHICS.icon}
              size={TAB_CONFIG.GRAPHICS.size}
              color={THEME.ICON.COLOR}
            />
          </CustomTabBarButton>
        ),
      }}
    />
    <Tabs.Screen
      name="user"
      options={{
        tabBarButton: (props) => (
          <CustomTabBarButton
            {...props}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            name={TAB_CONFIG.USER.name}>
            <FontAwesome
              name={TAB_CONFIG.USER.icon}
              size={TAB_CONFIG.USER.size}
              color={THEME.ICON.COLOR}
            />
          </CustomTabBarButton>
        ),
      }}
    />
  </Tabs>
);

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TAB_CONFIG.MEALS.name);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <TabNavigator selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  tabBar: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
    maxHeight: '10%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
