import React, { use, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  Button,
  List,
  IconButton,
  Appbar,
  Divider,
  Card,
  DefaultTheme
} from 'react-native-paper'
import * as SQLite from 'expo-sqlite';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const db = SQLite.openDatabaseSync('shoppingList.db');

export default function App() {

  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync('shoppingList.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS shoppingList (id INTEGER PRIMARY KEY NOT NULL, item TEXT, amount TEXT);
        `);

        const result = await database.getAllAsync('SELECT * FROM shoppingList');
        setShoppingList(result);
      } catch (error) {
        console.error("Tietokannan alustus epäonnistui:", error);
      }
    }

    initializeDatabase();
  }, []);

  const updateList = async () => {
    if (!db) return;
    try {
      const result = await db.getAllAsync('SELECT * FROM shoppingList');
      setShoppingList(result);
    } catch (error) {
      console.error("Listan päivitys epäonnistui:", error);
    }
  };

  const saveItem = async () => {
    if (item.length > 0 && db) {
      try {
        await db.runAsync('INSERT INTO shoppingList (item, amount) VALUES (?, ?)', [item, amount]);
        setItem('');
        setAmount('');
        updateList();
        Keyboard.dismiss();
      } catch (error) {
        console.error("Tallennusvirhe:", error);
        Alert.alert("Virhe", "Tallennus epäonnistui.");
      }
    }
  };

  const deleteItem = async (id) => {
    if (db) {
      try {
        await db.runAsync('DELETE FROM shoppingList WHERE id = ?', [id]);
        updateList();
      } catch (error) {
        console.error("Poistovirhe:", error);
      }
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <SafeAreaView style={styles.container}>

          <Appbar.Header elevated>
            <Appbar.Content title="Shopping List" />
          </Appbar.Header>

          <View style={styles.container}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <TextInput
                  label="Product"
                  mode='outlined'
                  value={item}
                  onChangeText={text => setItem(text)}
                  style={styles.input}
                />
                <TextInput
                  label="Amount"
                  mode='outlined'
                  value={amount}
                  onChangeText={text => setAmount(text)}
                  style={styles.input}
                />
                <Button
                  mode='contained'
                  onPress={saveItem}
                  icon="cart-plus"
                  style={styles.button}
                > Save Item </Button>
              </Card.Content>
            </Card>

            <FlatList
              data={shoppingList}
              keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <List.Item
                  title={item.item}
                  description={item.amount}
                  left={props => <List.Icon {...props} icon="shopping-outline" />}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="trash-can-outline"
                      iconColor='#B00020'
                      onPress={() => deleteItem(item.id)}
                    />
                  )}
                />
              )}
            />
          </View>

        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 4,
  },
});
