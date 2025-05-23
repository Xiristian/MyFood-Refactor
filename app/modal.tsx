import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { colors } from 'react-native-elements';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import { useNavigation } from 'expo-router';

// Constants
const OVERLAY_OPACITY = 0.9;
const MODAL_WIDTH_PERCENTAGE = '80%';
const MODAL_TOP_OFFSET = '-10%';

// Custom Hooks
const useCreateMeal = () => {
  const [description, setDescription] = useState('');
  const { mealRepository } = useDatabaseConnection();
  const navigation = useNavigation();

  const handleCreateMeal = async () => {
    if (!description.trim()) return;

    try {
      await mealRepository.createMeal({
        name: description,
        iconName: 'sunrise',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
    }
  };

  return {
    description,
    setDescription,
    handleCreateMeal,
  };
};

// Components
const Overlay: React.FC = () => (
  <View
    style={styles.overlay}
    lightColor={`rgba(0, 0, 0, ${OVERLAY_OPACITY})`}
    darkColor={`rgba(0, 0, 0, ${OVERLAY_OPACITY})`}
  />
);

const ModalContent: React.FC<{
  description: string;
  onDescriptionChange: (text: string) => void;
  onSubmit: () => void;
}> = ({ description, onDescriptionChange, onSubmit }) => (
  <View style={styles.modal} lightColor="#FFFCEB" darkColor="#3C3C3C">
    <Text style={styles.title}>Refeição</Text>
    <TextInput
      style={styles.input}
      value={description}
      onChangeText={onDescriptionChange}
      placeholder="Descrição"
      placeholderTextColor="#FFFCEB"
    />
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
      <Text style={styles.buttonText}>Criar</Text>
    </TouchableOpacity>
  </View>
);

export default function ModalScreen() {
  const { description, setDescription, handleCreateMeal } = useCreateMeal();

  return (
    <>
      <Overlay />
      <View style={styles.container}>
        <ModalContent
          description={description}
          onDescriptionChange={setDescription}
          onSubmit={handleCreateMeal}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: colors.grey0,
  },
  modal: {
    height: 300,
    width: MODAL_WIDTH_PERCENTAGE,
    top: MODAL_TOP_OFFSET,
    borderColor: colors.black,
    borderWidth: 5,
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    paddingTop: '20%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#547260',
    paddingBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#547260',
    backgroundColor: '#547260',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#FFF',
  },
  button: {
    height: 45,
    width: 150,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 45,
    backgroundColor: '#76A689',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
