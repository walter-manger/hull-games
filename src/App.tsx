import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from './services/firebase';
import { ref, set } from 'firebase/database';
import logo from './logo.svg';
import './App.css';

function App() {

  const createGame = (id: string, name: string = `what-the-hull`) => {
    console.log('setting...');
    set(ref(db, `games/${id}`), {
      name,
      created: (new Date()).getTime(),
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>

      <button onClick={ () => createGame(uuidv4()) }>Create Game</button>

    </div>
  );
}

export default App;
