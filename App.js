import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

export default function App() {
  const [times, setTimes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    pegarTimes();
  }, []);

  const pegarTimes = async () => {
    try {
      const response = await fetch('https://api.cartola.globo.com/clubes');
      const data = await response.json();
      
      let arrayTimes = Object.values(data);
      
      let timesFiltrados = arrayTimes.filter((t) => t.id != null && t.nome != null);
      
      timesFiltrados.sort((a, b) => {
        if(a.nome > b.nome) return 1;
        if(a.nome < b.nome) return -1;
        return 0;
      });

      setTimes(timesFiltrados);
      setCarregando(false);
    } catch (error) {
      console.log("vish, deu erro: ", error);
      setCarregando(false);
    }
  };

  const renderizarTime = ({ item }) => {
    return (
      <View style={styles.cardTime}>
        {item.escudos && item.escudos['60x60'] ? (
          <Image 
            source={{ uri: item.escudos['45x45'] }} 
            style={styles.logo} 
          />
        ) : (
          <View style={styles.semFoto} />
        )}
        
        <View style={styles.textos}>
          <Text style={styles.nomeTime}>{item.nome}</Text>
          <Text style={styles.apelido}>{item.apelido}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Times Brasileiros</Text>
      </View>

      {carregando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando times...</Text>
        </View>
      ) : (
        <FlatList
          data={times}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarTime}
          style={styles.lista}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  cabecalho: {
    padding: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    marginTop: 30
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    padding: 10,
  },
  cardTime: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  logo: {
    width: 45,
    height: 45,
  },
  semFoto: {
    width: 45,
    height: 45,
    backgroundColor: '#999',
  },
  textos: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  nomeTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  apelido: {
    fontSize: 14,
    color: 'gray',
  },
});