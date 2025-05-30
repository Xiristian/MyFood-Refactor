import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { THEME } from '@/constants/theme';

export default function GraphicsScreen() {
  return (
    <View
      style={styles.container}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}
      darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <Text>Em desenvolvimento...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
