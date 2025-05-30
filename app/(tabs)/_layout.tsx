import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, View, StyleSheet, PressableProps, GestureResponderEvent } from 'react-native';
import { THEME } from '@/constants/theme';
import { TAB_CONFIG } from '@/constants/navigation';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

interface CustomTabBarButtonProps extends PressableProps {
  children: React.ReactNode;
  setSelectedTab: (name: string) => void;
  selectedTab: string;
  name: string;
}

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

interface TabButtonProps {
  props: BottomTabBarButtonProps;
  setSelectedTab: (name: string) => void;
  selectedTab: string;
}

const MealsTabButton = ({ props, setSelectedTab, selectedTab }: TabButtonProps) => (
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
);

const GraphicsTabButton = ({ props, setSelectedTab, selectedTab }: TabButtonProps) => (
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
);

const UserTabButton = ({ props, setSelectedTab, selectedTab }: TabButtonProps) => (
  <CustomTabBarButton
    {...props}
    setSelectedTab={setSelectedTab}
    selectedTab={selectedTab}
    name={TAB_CONFIG.USER.name}>
    <FontAwesome name={TAB_CONFIG.USER.icon} size={TAB_CONFIG.USER.size} color={THEME.ICON.COLOR} />
  </CustomTabBarButton>
);

const renderMealsTabButton =
  (setSelectedTab: (name: string) => void, selectedTab: string) =>
  (props: BottomTabBarButtonProps) => (
    <MealsTabButton props={props} setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
  );

const renderGraphicsTabButton =
  (setSelectedTab: (name: string) => void, selectedTab: string) =>
  (props: BottomTabBarButtonProps) => (
    <GraphicsTabButton props={props} setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
  );

const renderUserTabButton =
  (setSelectedTab: (name: string) => void, selectedTab: string) =>
  (props: BottomTabBarButtonProps) => (
    <UserTabButton props={props} setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
  );

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
        tabBarButton: renderMealsTabButton(setSelectedTab, selectedTab),
      }}
    />
    <Tabs.Screen
      name="graphics"
      options={{
        tabBarButton: renderGraphicsTabButton(setSelectedTab, selectedTab),
      }}
    />
    <Tabs.Screen
      name="user"
      options={{
        tabBarButton: renderUserTabButton(setSelectedTab, selectedTab),
      }}
    />
  </Tabs>
);

export default function TabLayout() {
  const [selectedTab, setSelectedTab] = React.useState<string>(TAB_CONFIG.MEALS.name);

  return (
    <View style={styles.container}>
      <TabNavigator selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  tabBar: {
    backgroundColor: THEME.COLORS.BACKGROUND.DARK,
    flex: 1,
    maxHeight: 80,
  },
});
