import React, { useState, useEffect, FormEvent } from 'react';
import logo from '../../assets/logo.svg';
import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
interface Item {
  id: number;
  title: string;
  image_url: string;
}
interface UF {
  id: number;
  sigla: string;
  nome: string;
}
interface City {
  id: number;
  nome: string;
}
const CreatePoint: React.FC = () => {
  const history = useHistory();
  const [items, setItems] = useState<Item[]>([]);
  const [itemsSelected, setItemsSelected] = useState<number[]>([]);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');

  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [ufSelected, setUfSelected] = useState<string>('0');
  const [citySelected, setCitySelected] = useState<string>('0');
  const [inicitalPosition, setInicitalPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [positionSelected, setPositionSelected] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      setInicitalPosition([latitude, longitude]);
    });
  }, []);
  useEffect(() => {
    api.get('/items').then(({ data }) => {
      setItems(data);
    });
  }, []);
  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(({ data }) => {
        setUfs(data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`
      )
      .then(({ data }) => {
        setCities(data);
      });
  }, [ufSelected]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    setPositionSelected([event.latlng.lat, event.latlng.lng]);
  };
  const handleSelectItem = (id: number) => {
    if (itemsSelected.includes(id)) {
      setItemsSelected(itemsSelected.filter((item) => item !== id));
      return;
    }
    setItemsSelected([...itemsSelected, id]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      name,
      email,
      whatsapp,
      latitude: positionSelected[0],
      longitude: positionSelected[1],
      city: citySelected,
      uf: ufSelected,
      items: itemsSelected,
    };
    await api.post('/points', data);
    history.push('/');
  };
  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt='Ecoleta' />
        <Link to='/'>
          <FiArrowLeft />
          Volta para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastrdo do <br />
          ponto de Coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className='field'>
            <label htmlFor='name'> Nome da entidade</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='email'> E-mail</label>
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='field'>
              <label htmlFor='Whatsapp'> Whatsapp</label>
              <input
                type='text'
                name='whatsapp'
                id='whatsapp'
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereços</h2>
            <span>Selecione um endereço no mapa</span>
          </legend>

          <Map center={inicitalPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={positionSelected} />
          </Map>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'> Estado (UF)</label>
              <select
                value={ufSelected}
                onChange={(e) => setUfSelected(e.target.value)}
                name='uf'
                id='uf'
              >
                <option value='0'>Selecione uma uf</option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.sigla}>
                    {uf.nome} - {uf.sigla}
                  </option>
                ))}
              </select>
            </div>
            <div className='field'>
              <label htmlFor='city'> Cidade</label>
              <select
                value={citySelected}
                onChange={(e) => setCitySelected(e.target.value)}
                name='city'
                id='city'
              >
                <option value='0'>Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.nome}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítems de coleta</h2>
            <span>Selecione um ou mais ítems abaixo</span>
          </legend>
          <ul className='items-grid'>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={itemsSelected.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type='submit'>Cadastrar ponto de Coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
