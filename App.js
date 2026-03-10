import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const db = SQLite.openDatabaseSync('shoppingList.db');

export default function App() {

  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS shoppingList (id INTEGER PRIMARY KEY NOT NULL, item TEXT, amount TEXT);
      `);
    updateList();
  }, []);

  const updateList = () => {
    const result = db.getAllSync('SELECT * FROM shoppingList');
    setShoppingList(result);
  };

  const saveItem = () => {
    if (item.length > 0) {
      db.runSync('INSERT INTO shoppingList (item, amount) VALUES (?, ?)', [item, amount]);
      setItem('');
      setAmount('');
      updateList();
    }
  };

  const deleteItem = (id) => {
    db.runSync('DELETE FROM shoppingList WHERE id = ?', [id]);
    updateList();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput style={styles.input}
          placeholder='Item'
          onChangeText={text => setItem(text)}
          value={item}
        />

        <TextInput style={styles.input}
          placeholder='Amount'
          onChangeText={text => setAmount(text)}
          value={amount}
        />

        <View style={styles.buttons}>
          <Button title='SAVE' onPress={saveItem} />
        </View>

        <Text style={styles.title}>Shopping List</Text>
        <FlatList
          data={shoppingList}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <Text style={styles.listItem}>{item.item}, {item.amount}</Text>
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={styles.boughtText}> Bought</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <StatusBar style='auto' />
      </SafeAreaView>
    </SafeAreaProvider>
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

  list: {
    width: '80%',
  },

  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  boughtText: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 10,
  },
});
