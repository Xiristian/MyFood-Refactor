import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { THEME } from '@/constants/theme';

interface SidebarProps {
  isOpen: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, style }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <Modal visible={isOpen} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={() => navigation.navigate('index')}
        />
        <Animated.View
          style={[
            styles.container,
            style,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('index')}>
            <FontAwesome name="user" size={18} color="#344e41" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('meals')}>
            <FontAwesome name="book" size={18} color="#344e41" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Diário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('camera')}>
            <FontAwesome name="camera" size={18} color="#344e41" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Escanear alimento</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    height: '100%',
    position: 'absolute',
    width: 300,
    zIndex: 1000,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
  },
  menuItemText: {
    fontSize: 18,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Sidebar;
