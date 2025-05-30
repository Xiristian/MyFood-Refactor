import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
import { Text, View } from './Themed';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { THEME } from '@/constants/theme';
import { RootStackParamList } from '@/types/navigation';
import { EventEmitter } from '@/utils/EventEmitter';
import { MealService } from '@/database/services/MealService';

const MEAL_ICONS = [
  { name: 'sunrise', label: 'Café da Manhã' },
  { name: 'sun', label: 'Almoço' },
  { name: 'sunset', label: 'Café da Tarde' },
  { name: 'moon', label: 'Jantar' },
  { name: 'coffee', label: 'Lanche' },
];

interface ExpandedActionsProps {
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}

export const ExpandedActions: React.FC<ExpandedActionsProps> = ({ id, date, loadData }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mealService = MealService.getInstance();
  const [isMealInfoModalVisible, setIsMealInfoModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(0);

  React.useEffect(() => {
    const subscription = EventEmitter.addListener('photoTaken', loadData);
    return () => {
      subscription.remove();
    };
  }, [loadData]);

  const handleNavigate = (screen: 'camera' | 'description-screen') => {
    if (screen === 'camera') {
      navigation.navigate(screen, {
        id: id.toString(),
        date: date.toISOString(),
      });
    } else {
      navigation.navigate(screen, { mealId: id });
    }
  };

  async function deleteMeal(id: number): Promise<void> {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir esta refeição?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await mealService.deleteMeal(id);
            await loadData();
          } catch (error) {
            console.error('Erro ao deletar refeição:', error);
            Alert.alert('Erro', 'Não foi possível excluir a refeição. Tente novamente.');
          }
        },
      },
    ]);
  }

  async function handleSaveInfo(): Promise<void> {
    try {
      await mealService.updateMeal(id, { 
        name: mealName,
        iconName: selectedIcon,
        position: selectedPosition
      });
      await loadData();
      setIsMealInfoModalVisible(false);
    } catch (error) {
      console.error('Erro ao alterar informações:', error);
      Alert.alert('Erro', 'Não foi possível alterar as informações. Tente novamente.');
    }
  }

  function changeMealInfo(): void {
    setIsMealInfoModalVisible(true);
  }

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
        <TouchableOpacity onPress={() => deleteMeal(id)}>
          <View
            style={styles.iconWithText}
            lightColor={THEME.COLORS.BACKGROUND.LIGHT}
            darkColor={THEME.COLORS.BACKGROUND.DARK}>
            <Feather name="trash" size={24} color={THEME.COLORS.SECONDARY} style={styles.icon} />
            <Text style={styles.iconDescription}>Deletar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMealInfo()}>
          <View
            style={styles.iconWithText}
            lightColor={THEME.COLORS.BACKGROUND.LIGHT}
            darkColor={THEME.COLORS.BACKGROUND.DARK}>
            <Feather name="repeat" size={24} color={THEME.COLORS.SECONDARY} style={styles.icon} />
            <Text style={styles.iconDescription}>Alterar informações</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isMealInfoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMealInfoModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Informações da Refeição</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da refeição"
              value={mealName}
              onChangeText={setMealName}
            />
            <Text style={styles.sectionTitle}>Posição da Refeição</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.positionScroll}>
              {MEAL_ICONS.map((icon, index) => (
                <TouchableOpacity
                  key={icon.name}
                  style={[
                    styles.positionItem,
                    selectedPosition === index && styles.selectedPosition
                  ]}
                  onPress={() => setSelectedPosition(index)}>
                  <Text style={[
                    styles.positionText,
                    selectedPosition === index && styles.selectedPositionText
                  ]}>
                    {icon.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>Ícone</Text>
            <ScrollView>
              <View style={styles.iconGrid}>
                {MEAL_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconGridItem,
                      selectedIcon === icon.name && styles.selectedIconItem
                    ]}
                    onPress={() => setSelectedIcon(icon.name)}>
                    <Feather name={icon.name as any} size={32} color={THEME.COLORS.SECONDARY} />
                    <Text style={styles.iconLabel}>{icon.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsMealInfoModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveInfo}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  expandedContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  expandedContentIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  icon: {
    marginBottom: 4,
  },
  iconDescription: {
    color: THEME.COLORS.SECONDARY,
    fontSize: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  iconGridItem: {
    alignItems: 'center',
    borderColor: THEME.COLORS.SECONDARY,
    borderRadius: 8,
    borderWidth: 1,
    margin: 5,
    padding: 10,
    width: '30%',
  },
  iconLabel: {
    color: THEME.COLORS.SECONDARY,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  iconWithText: {
    alignItems: 'center',
  },
  input: {
    backgroundColor: THEME.COLORS.SECONDARY,
    borderRadius: 8,
    color: THEME.COLORS.TEXT.LIGHT,
    height: 40,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    borderRadius: 16,
    maxHeight: '80%',
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    color: THEME.COLORS.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedIconItem: {
    backgroundColor: `${String(THEME.COLORS.PRIMARY)}20`,
    borderColor: THEME.COLORS.PRIMARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: THEME.COLORS.SECONDARY,
  },
  saveButton: {
    backgroundColor: THEME.COLORS.PRIMARY,
  },
  buttonText: {
    color: THEME.COLORS.TEXT.LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: THEME.COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  positionScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  positionItem: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    borderColor: THEME.COLORS.SECONDARY,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 5,
    padding: 10,
  },
  positionText: {
    color: THEME.COLORS.SECONDARY,
    fontSize: 14,
  },
  selectedPosition: {
    backgroundColor: `${String(THEME.COLORS.PRIMARY)}20`,
    borderColor: THEME.COLORS.PRIMARY,
  },
  selectedPositionText: {
    color: THEME.COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});
