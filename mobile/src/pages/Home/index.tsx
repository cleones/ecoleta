import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

interface UF {
  sigla: string;
  nome: string;
}
interface City {
  id: number;
  nome: string;
}

const Home: React.FC = () => {
  const natvigation = useNavigation();
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [ufSelected, setufSelected] = useState<string>('');
  const [citySelected, setCitySelected] = useState<string>('');

  useEffect(() => {
    Axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    ).then(({ data }) => {
      setUfs(data);
    });
  }, []);

  useEffect(() => {
    Axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`
    ).then(({ data }) => {
      setCities(data);
    });
  }, [ufSelected]);

  const handleNavigationToPoints = () => {
    natvigation.navigate('Points', {
      city: citySelected,
      uf: ufSelected,
    });
  };
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}> Seu marketplace de colete de residuos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>
      <RNPickerSelect
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 20,
            right: 10,
          },
        }}
        Icon={() => {
          return <Icon name='chevron-down' size={24} color='gray' />;
        }}
        placeholder={{
          label: 'Selecione uma UF...',
          value: null,
          color: '#9EA0A4',
        }}
        value={ufSelected}
        onValueChange={(value) => setufSelected(value)}
        items={ufs.map((uf) => ({
          label: `${uf.nome} - ${uf.sigla}`,
          value: uf.sigla,
        }))}
      />
      <RNPickerSelect
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 20,
            right: 10,
          },
        }}
        Icon={() => {
          return <Icon name='chevron-down' size={24} color='gray' />;
        }}
        value={citySelected}
        placeholder={{
          label: 'Selecione uma Cidade...',
          value: null,
          color: '#9EA0A4',
        }}
        onValueChange={(value) => setCitySelected(value)}
        items={cities.map((city) => ({
          label: city.nome,
          value: city.nome,
        }))}
      />
      <View style={styles.footer}>
        <RectButton
          style={styles.button}
          onPress={() => {
            handleNavigationToPoints();
          }}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name='arrow-right' color='#fff' size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}> Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});
export default Home;
