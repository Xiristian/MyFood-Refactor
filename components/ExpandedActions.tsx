import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { THEME } from '@/constants/theme';
import { RootStackParamList } from '@/types/navigation';

interface ExpandedActionsProps {
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}

export const ExpandedActions: React.FC<ExpandedActionsProps> = ({ id, date, loadData }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = (screen: 'camera' | 'description-screen') => {
    navigation.navigate(screen, { id, date, loadData });
  };

  return (
    <View style={styles.expandedContent}>
      <View
        style={styles.expandedContentIconsRow}
        lightColor={THEME.COLORS.BACKGROUND.LIGHT}
        darkColor={THEME.COLORS.BACKGROUND.DARK}>
        <TouchableOpacity onPress={() => handleNavigate('camera')}>
          <View
            style={styles.iconWithText}
            lightColor={THEME.COLORS.BACKGROUND.LIGHT}
            darkColor={THEME.COLORS.BACKGROUND.DARK}>
            <Feather name="camera" size={24} color={THEME.COLORS.SECONDARY} style={styles.icon} />
            <Text style={styles.iconDescription}>Fotografar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('description-screen')}>
          <View
            style={styles.iconWithText}
            lightColor={THEME.COLORS.BACKGROUND.LIGHT}
            darkColor={THEME.COLORS.BACKGROUND.DARK}>
            <Feather name="edit" size={24} color={THEME.COLORS.SECONDARY} style={styles.icon} />
            <Text style={styles.iconDescription}>Descrever</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  expandedContent: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    width: '70%',
  },
  expandedContentIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.MARGIN.VERTICAL,
  },
  icon: {
    marginRight: THEME.SPACING.MARGIN.HORIZONTAL,
  },
  iconDescription: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.NORMAL,
    marginTop: THEME.SPACING.MARGIN.VERTICAL,
  },
  iconWithText: {
    alignItems: 'center',
  },
});
