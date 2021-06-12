import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from './styles.module.scss';

import { signIn, signOut, useSession } from 'next-auth/client';

import RightDiv from '../components/rightDiv/RightDiv';
import LeaftDiv from '../components/LeaftDiv/LeaftDiv';
import MapDiv from '../components/MapDiv/MapDiv';

export default function Home() {
  const MapDiv = dynamic(() => import('../components/MapDiv/MapDiv'), {
    ssr: false,
  });
  const [session, loading] = useSession();
  return (
    <div className={styles.mainPage}>
      <Head>
        <title>Create Next App</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </Head>
      <LeaftDiv />
      <MapDiv />
      <RightDiv />
    </div>
  );
}
