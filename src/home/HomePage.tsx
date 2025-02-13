import React from 'react'
import { RouterLink } from '@/shared/components';
import styles from './HomePage.module.scss';

const HomePage = () => {
  return (
    <div
    className={styles.main}>
     <section>
      <RouterLink
        className='button-primary'
        href="/account/create-account">
          Open a bank account
      </RouterLink>
    </section> 
   </div>
  )
}

export default HomePage