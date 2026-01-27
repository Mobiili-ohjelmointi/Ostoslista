import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {

  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  const addItem = () => {
    if (item.length > 0) {
      setShoppingList([...shoppingList, { key: Date.now().toString(), text: item }]);
      setItem('');
    }
  };

  const clear = () => {
    setShoppingList([]);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input}
        onChangeText={text => setItem(text)}
        value={item}
      />

      <View style={styles.buttons}>
        <Button title='ADD' onPress={addItem} />
        <Button title='CLEAR' onPress={clear} />
      </View>

      <Text style={styles.title}>Shopping List</Text>
      <FlatList data={shoppingList}
        renderItem={({ item }) => <Text style={styles.listItem}>{item.text}</Text>}
        keyExtractor={item => item.key}
      />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 100,
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 20,
    marginBottom: 10,
  },

  listItem: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
});
