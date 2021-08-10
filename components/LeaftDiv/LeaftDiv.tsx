import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import api from '../../utils/api';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';
import { ObjectId } from 'bson';
import { TextField } from '@material-ui/core';
import locationContext from '../../context/location';
import axios from 'axios';

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

interface cityLocation {
  coordinates: number[];
  city: string;
}

export default function leaftDiv() {
  const { tempLocation } = useContext(locationContext);
  const [session, loading] = useSession();
  const [userData, setUserData] = useState<IuserData>({
    name: ' ',
    email: ' ',
    locales: {
      name_local: ' ',
      image: 'null',
      description: 'null',
      coordinates: [0, 0],
    },
  });
  const [name, setName] = useState<string>();
  const [loggedAccount, setLoggedAccount] = useState<boolean>(false);
  const [nameForm, setNameForm] = useState<string>('aa');
  const [imageForm, setImageForm] = useState<string>('aa ');
  const [descriptionForm, setDescriptitonForm] = useState<string>('aa');
  //const [errorCount, setErrorCount] = useState(0);
  const { data, error } = useSWR(
    !loggedAccount && !loading ? `/api/users/${session?.user.email}` : null,
    api
  );
  // useEffect(() => {
  //   if (session && data) {
  //     const newUser: IuserData = {
  //       _id: data?.data._id,
  //       name: data?.data.name,
  //       email: data?.data.email,
  //       locales: {
  //         name_local: data?.data.locales.name_local,
  //         image: data?.data.locales.name_local,
  //         description: data?.data.locales.description,
  //         coordinates: data?.data.locales.coordinates,
  //         created_at: data?.data.locales.created_at,
  //       },
  //     };
  //     setUserData(newUser);
  //     console.log(userData);
  //   }
  // }, [data]);

  async function submitName() {
    const newUser: IuserData = {
      name: name,
      email: session.user.email,
      locales: {
        name_local: ' ',
        image: ' ',
        description: ' ',
        coordinates: [0, 0],
      },
    };
    try {
      await axios.post(`${'http://localhost:3000'}/api/users`, newUser);
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newLocale = {
      email: session.user.email,
      locales: {
        name_local: nameForm,
        image: imageForm,
        description: descriptionForm,
        coordinates: [tempLocation.coordinates[0], tempLocation.coordinates[1]],
      },
    };
    try {
      await axios.put(`${'http://localhost:3000'}/api/users`, newLocale);
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  useEffect(() => {
    setNameForm(tempLocation.city);
  }, [tempLocation]);

  useEffect(() => {
    if (session?.user.email !== data?.data.email) setLoggedAccount(true);
  }, [error]);

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
            {tempLocation.city}
            <button onClick={() => signOut()}>Sign out</button>
            <form onSubmit={handleSubmit}>
              <strong>Register a place here</strong>
              <p>Location name:</p>
              <input
                type="text"
                value={nameForm}
                onChange={(e) => setNameForm(e.target.value)}
                placeholder="Insira um nome para o local"
              />
              <p>Location image(link):</p>
              <input
                type="text"
                value={imageForm}
                onChange={(e) => setImageForm(e.target.value)}
                placeholder="Insira um link para a imagem"
              />
              <p>Description:</p>
              <textarea
                name="desscription"
                value={descriptionForm}
                onChange={(e) => setDescriptitonForm(e.target.value)}
                placeholder="Insira alguma descrição sobre o lugar"
              />
              <button type="submit">Register Location</button>
            </form>
          </div>
        )}
        {loggedAccount && (
          <>
            <h1>Coloque seu nome para continuar como: {session?.user.email}</h1>
            <form onSubmit={submitName} noValidate autoComplete="off">
              <TextField
                id="outlined-basic"
                label="Name"
                value={name}
                onChange={(e) => (
                  setName(e.target.value), console.log(userData)
                )}
                variant="outlined"
              />
              <button type="submit"> submit</button>
            </form>
            <button onClick={() => signOut()}>Try another email</button>
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
