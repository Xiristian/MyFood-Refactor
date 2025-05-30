import React from 'react';
import { StyleSheet } from 'react-native';
import Logo from './Logo';
import { Text, View } from './Themed';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

const Header: React.FC<BottomTabHeaderProps> = (props: BottomTabHeaderProps) => {
  return (
    <View style={styles.headerContainer} {...props}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{props?.options?.title}</Text>
        <Text style={styles.headerTitle}>OLAA</Text>
        <Logo />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: '#547260',
    height: '13%',
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Header;
