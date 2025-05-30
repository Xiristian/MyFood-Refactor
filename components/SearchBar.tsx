import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

interface SearchBarProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChangeText }) => {
  const [text, setText] = useState('');

  const handleTextChange = (newText: string) => {
    setText(newText);
    onChangeText(newText);
  };

  const clearText = () => {
    setText('');
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={clearText} style={styles.clearIconContainer}>
        <Icon name="close" type="material" color={text ? '#76A689' : 'transparent'} size={24} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={handleTextChange}
        onEndEditing={() => onChangeText(text)}
      />
      <Icon
        name="search"
        type="material"
        color="#888"
        size={24}
        containerStyle={styles.iconContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clearIconContainer: {
    marginRight: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(118, 166, 137, 0.1)',
    borderRadius: 50,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  iconContainer: {
    marginLeft: 10,
  },
  input: {
    color: 'grey',
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default SearchBar;
