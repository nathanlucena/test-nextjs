import React from 'react';
import styles from './styles.module.scss';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function RightDiv() {
  return (
    <div className={styles.rightDiv}>
      <div>
        <p>asda</p>
      </div>
    </div>
  );
}
