import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

// Constants
const THEME = {
  COLORS: {
    BACKGROUND: {
      LIGHT: '#FFFCEB',
      DARK: '#3C3C3C',
    },
  },
};

export default function GraphicsScreen() {
  return (
    <View 
      style={styles.container} 
      lightColor={THEME.COLORS.BACKGROUND.LIGHT} 
      darkColor={THEME.COLORS.BACKGROUND.DARK}
    >
      <Text>Em desenvolvimento...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
