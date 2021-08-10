import { Provider } from 'next-auth/client';
import { useState } from 'react';
import locationContext from '../context/location';
import '../styles/globals.css';

interface cityLocation {
  coordinates: number[];
  city: string;
}

function MyApp({ Component, pageProps }) {
  const [tempLocation, setTempLocation] = useState<cityLocation>({
    city: '',
    coordinates: [0, 0],
  });

  return (
    <Provider session={pageProps.session}>
      <locationContext.Provider value={{ tempLocation, setTempLocation }}>
        <Component {...pageProps} />
      </locationContext.Provider>
    </Provider>
  );
}

export default MyApp;
