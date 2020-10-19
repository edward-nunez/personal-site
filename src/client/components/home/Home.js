import React from 'react';

import Logo from '../../common/Logo';

import '../App.style.scss';
import './Home.style.scss';

export default function Home() {
  return (
    <div
      className="container content"
      style={{ textAlign: 'center', fontSize: '22px', paddingTop: '50px' }}
    >
      <h1>Hello, I&apos;m Edward Nunez</h1>
      <p>
        Passionate and experienced Full Stack Software Engineer, with cloud
        solutions and automation background.
      </p>
      <Logo />
    </div>
  );
}
