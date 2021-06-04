import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Home() {
  const [session, loading] = useSession();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1> oi </h1>

        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn('auth0')}>Sign in</button>
          </>
        )}
        {session && (
          <>
            Signed in as {session.user.name} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        {loading && (
          <div>
            <h1>CARREGANDO</h1>
          </div>
        )}
      </main>
    </div>
  );
}
