import React from 'react';
import styles from './styles.module.scss';
import { signIn, signOut, useSession } from 'next-auth/client';
import axios from 'axios';

export default function RightDiv() {
  const [session, loading] = useSession();

  async function gett() {
    try {
      const a = await axios.get(`${'http://localhost:3000'}/api/users`);
      console.log(a.data);
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <div className={styles.rightDiv}>
      <div>
        <button onClick={() => gett()}>asda</button>
      </div>
    </div>
  );
}
