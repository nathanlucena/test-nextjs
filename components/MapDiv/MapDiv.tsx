import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
} from 'react-leaflet';
import styles from './styles.module.scss';
import L from 'leaflet';

const iconPerson = new L.Icon({
  iconUrl: '/iconsLocations/iconPerson.svg',
  iconSize: new L.Point(60, 60),
});

const iconMarker = new L.Icon({
  iconUrl: '/iconsLocations/iconMarker.svg',
  iconSize: new L.Point(50, 50),
});

export default function MapDiv() {
  const [locationUser, setLocationUser] = useState([0, 0]);
  const [locationClick, setLocationClick] = useState<number[]>([0, 0]);
  const [permimsion, setPermission] = useState(false);
  const [weather, setWeather] = useState({
    city: '',
    main: '',
    temp: 0,
    idIcon: '',
    descrption: '',
  });
  const [skyColor, setSkycolor] = useState('#2E4482');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let arrayLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setLocationClick(arrayLocation);
          setLocationUser(arrayLocation);
          setPermission(true);
        },
        function (error) {
          console.log(error);
        }
      );
    } else {
      alert('opa Amigao');
    }
  }, [permimsion]);

  async function getWeather(lat: number, long: number) {
    let res = await axios.get(
      'http://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: lat,
          lon: long,
          appid: '3e6a675d0c4823207486320e2ce71e36',
          lang: 'pt',
          units: 'metric',
        },
      }
    );
    setWeather({
      city: res.data.name,
      main: res.data.weather[0].main,
      temp: res.data.main.temp,
      idIcon: res.data.weather[0].icon,
      descrption: res.data.weather[0].description,
    });
  }

  useEffect(() => {
    getWeather(locationUser[0], locationUser[1]);
    if (weather.idIcon[2] === 'n') {
      setSkycolor('#2E4482');
    } else {
      setSkycolor('#87CEEB');
    }
    console.log(1);
  }, [permimsion]);

  function UserMarker() {
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        const { lat, lng } = e.latlng;
        setPosition({
          latitude: lat,
          longitude: lng,
        });
        map.flyTo([1, 2], map.getZoom());
      },
    });

    return position.latitude !== 0 ? (
      <Marker
        position={[position.latitude, position.longitude]}
        interactive={false}
        icon={iconPerson}
      />
    ) : null;
  }

  function ClickLocale() {
    useMapEvents({
      click: (event) => {
        let arrayLocation = [event.latlng.lat, event.latlng.lng];
        setLocationClick(arrayLocation);
        console.log(weather);
      },
    });

    return null;
  }

  return (
    <div className={styles.map}>
      <MapContainer
        center={[locationClick[0], locationClick[1]]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserMarker />
        <Marker
          position={[locationClick[0], locationClick[1]]}
          icon={iconMarker}
        >
          <Popup>
            <p>
              {' '}
              {locationClick[0]} / {locationClick[1]}{' '}
            </p>
          </Popup>
        </Marker>
        <Marker position={[locationUser[0], locationUser[1]]} icon={iconPerson}>
          <Popup>
            <p>
              {' '}
              {locationUser[0]} / {locationUser[1]}{' '}
            </p>
          </Popup>
        </Marker>
        <ClickLocale />
        <LayersControl position="topright">
          <h1>oi meu chapa</h1>
        </LayersControl>
      </MapContainer>
      <div className={styles.auxilio}></div>
    </div>
  );
}
