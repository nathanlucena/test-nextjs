import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import api from '../../utils/api';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';
import { NextPage } from 'next';
import { ObjectId } from 'bson';

interface IuserData {
  _id: ObjectId;
  name: string;
  email: string;
  locales: {
    name_local: string;
    image: string;
    description: string;
    coordinates: number[];
    created_at: Date;
  };
}

export default function leaftDiv({}) {
  const [userData, setUserData] = useState<IuserData>();
  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/users/${session?.user.email}`, api);

  useEffect(() => {
    const newUser: IuserData = {
      _id: data?.data._id,
      name: data?.data.name,
      email: data?.data.email,
      locales: {
        name_local: data?.data.locales.name_local,
        image: data?.data.locales.image,
        description: data?.data.locales.description,
        coordinates: data?.data.locales.coordinates,
        created_at: data?.data.locales.created_at,
      },
    };
    setUserData(newUser);
    console.log(userData);
  }, [data]);

  return (
    <div className={styles.leaftDiv}>
      <div>
        {!session && (
          <>
            Sing in <br />
            <button onClick={() => signIn('auth0')}>Sign in</button>
          </>
        )}
        {session && data && (
          <div>
            <p>Wellcome {data.data.name}</p>
            Signed in as {session?.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        )}
        {error && (
          <>
            <h1>email "{session?.user.email}" não cadastrado</h1>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        {loading && (
          <div>
            <h1>CARREGANDO</h1>
          </div>
        )}
      </div>
    </div>
  );
}
