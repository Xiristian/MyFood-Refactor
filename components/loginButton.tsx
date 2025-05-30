import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

const LoginButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>ENTRAR</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#76A689',
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 45,
    width: 150,
  },
  buttonText: {
    color: '#ffffff',
    paddingHorizontal: 10,
  },
});

export default LoginButton;
