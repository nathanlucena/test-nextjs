import axios from 'axios';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
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
import locationContext from '../../context/location';

interface IuserData {
  name: string;
  email: string;
  locales: {
    name_local: string;
    image: string;
    description: string;
    coordinates: number[];
  };
}

const iconPerson = new L.Icon({
  iconUrl: '/iconsLocations/iconPerson.svg',
  iconSize: new L.Point(60, 60),
});

const iconMarker = new L.Icon({
  iconUrl: '/iconsLocations/iconMarker.svg',
  iconSize: new L.Point(50, 50),
});

interface cityLocation {
  coordinates: number[];
  city: string;
}

interface weatherType {
  city: string;
  main: string;
  temp: number;
  idIcon: string;
  descrption: string;
}

export default function MapDiv() {
  const { setTempLocation } = useContext(locationContext);
  const [locationClickTemp, setLocationClickTemp] = useState<number[]>([0, 0]);
  const [locationUser, setLocationUser] = useState<number[]>([0, 0]);
  const [permimsion, setPermission] = useState<boolean>(false);
  const [dbUsers, setDbUsers] = useState<IuserData[]>([
    {
      name: '',
      email: '',
      locales: {
        name_local: '',
        image: '',
        description: '',
        coordinates: [0, 0],
      },
    },
  ]);
  const [weatherClick, setWeatherClick] = useState<weatherType>({
    city: '',
    main: '',
    temp: 0,
    idIcon: '',
    descrption: '',
  });
  const [weatherUser, setWeatherUser] = useState<weatherType>({
    city: '',
    main: '',
    temp: 0,
    idIcon: '',
    descrption: '',
  });
  //const [skyColor, setSkycolor] = useState('#2E4482');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let arrayLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setLocationUser(arrayLocation);
          setPermission(true);
        },
        function (error) {}
      );
    } else {
      alert('opa Amigao');
    }
  }, [permimsion]);

  async function getWeatherClick(lat: number, long: number) {
    try {
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
      setWeatherClick({
        city: res.data.name,
        main: res.data.weather[0].main,
        temp: res.data.main.temp,
        idIcon: res.data.weather[0].icon,
        descrption: res.data.weather[0].description,
      });
    } catch (error) {
      return console.log('clica certo');
    }
  }

  async function getWeatherUser(lat: number, long: number) {
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
    setWeatherUser({
      city: res.data.name,
      main: res.data.weather[0].main,
      temp: res.data.main.temp,
      idIcon: res.data.weather[0].icon,
      descrption: res.data.weather[0].description,
    });
  }

  useEffect(() => {
    getWeatherUser(locationUser[0], locationUser[1]);
  }, [permimsion]);

  useEffect(() => {
    async function gett() {
      try {
        const response = await axios.get(
          `${'http://localhost:3000'}/api/users`
        );
        setDbUsers(response.data.map((e) => e));
        console.log(dbUsers);
      } catch (err) {
        alert(err.response.data.error);
      }
    }
    gett();
  }, [weatherClick]);

  function handleIcon(link) {
    const icon = new L.Icon({
      iconUrl: '/iconsLocations/julio.png',
      iconSize: new L.Point(60, 60),
    });

    return icon;
  }

  function DbMarkers() {
    // dbUsers.map((user) => {
    //   const iconPerson = new L.Icon({
    //     iconUrl: '/iconsLocations/iconPerson.svg',
    //     iconSize: new L.Point(60, 60),
    //   });
    // });

    return (
      <>
        {dbUsers.map((user: IuserData, index) => (
          <Marker
            key={index}
            position={[
              user.locales.coordinates[0],
              user.locales.coordinates[1],
            ]}
            interactive={true}
            icon={handleIcon(user.locales.image)}
          >
            <Popup className="clickPopup">{user.name}</Popup>
          </Marker>
        ))}
        ;
      </>
    );
  }

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
        //map.flyTo([1, 2], map.getZoom());
      },
    });

    return position.latitude !== 0 ? (
      <Marker
        position={[position.latitude, position.longitude]}
        interactive={false}
        icon={iconPerson}
      >
        <Popup className="clickPopup">
          <h3>Cidade:{weatherClick.city}</h3>
          <p>Tempo:{weatherClick.descrption}</p>
          <button onClick={() => exportLocation([position[0], position[1]])}>
            Save
          </button>
        </Popup>
      </Marker>
    ) : null;
  }

  function ClickLocale() {
    useMapEvents({
      click: (event) => {
        let arrayLocation = [event.latlng.lat, event.latlng.lng];
        setLocationClickTemp(arrayLocation);
        getWeatherClick(arrayLocation[0], arrayLocation[1]);
        console.log(weatherClick);
      },
    });

    return renderClick();
  }

  function renderClick() {
    if (locationClickTemp[0] !== 0) {
      return (
        <>
          <Marker
            position={[locationClickTemp[0], locationClickTemp[1]]}
            icon={iconMarker}
          >
            <Popup className="clickPopup">
              <h3>Cidade:{weatherClick.city}</h3>
              <p>Tempo:{weatherClick.descrption}</p>
              <button
                onClick={() =>
                  exportLocation([locationClickTemp[0], locationClickTemp[1]])
                }
              >
                Save
              </button>
            </Popup>
          </Marker>
        </>
      );
    } else {
      return null;
    }
  }

  function exportLocation(coordinates: number[]) {
    const exportL: cityLocation = {
      city: weatherClick.city,
      coordinates: coordinates,
    };
    setTempLocation(exportL);
  }

  return (
    <div className={styles.map}>
      <MapContainer
        center={[0, 1]}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <DbMarkers />
        <UserMarker />
        {/* renderizando o marker de click */}
        {/* <RenderClick /> */}
        <Marker position={[locationUser[0], locationUser[1]]} icon={iconPerson}>
          <Popup className="clickPopup">
            <h3>Cidade:{weatherUser.city}</h3>
            <p>Tempo:{weatherUser.descrption}</p>
            <button
              onClick={() => exportLocation([locationUser[0], locationUser[1]])}
            >
              Save
            </button>
          </Popup>
        </Marker>
        <ClickLocale />
        <LayersControl position="topright">
          <h1>oi meu chapa</h1>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
