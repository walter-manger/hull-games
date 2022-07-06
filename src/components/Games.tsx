import { useState } from 'react';
import { ref, set, query, limitToLast, remove } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import {
  Link, Navigate
} from 'react-router-dom'
import { db } from '../services/firebase';
import { useList } from 'react-firebase-hooks/database'
// import { GameDefinition } from '../types';

function Games() {
  const [gameId, setGameId] = useState('');
  const gamesRef = query(ref(db, 'games'), limitToLast(10));
  const [games, loading, error] = useList(gamesRef);


  const createGame = async (id: string, name: string = `what-the-hull`) => {
    //event.preventDefault();
    await set(ref(db, `games/${id}`), {
      name,
      created: (new Date()).getTime(),
      started: false,
    });
    setGameId(id)
  }

  const deleteGame = (id: string) => {
    console.log('deleting');
    const removeGame = async () => {
        await remove(ref(db, `games/${id}`));
    }
    removeGame();
  }

  return (
    <div>
      {gameId && (
        <Navigate to={`/games/${gameId}`} replace={true} />
      )}
      <h2>Games</h2>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Document: Loading...</span>}
      {games && (
        <ul>
          {games.map((game: any) => (
            <li key={game.key}><Link to={`/games/${game.key}`}>{game.val().name}</Link> <button onClick={ () => deleteGame(game.key) }>D</button></li>
          ))}
        </ul>
      )}
       <button onClick={ () => createGame(uuidv4()) }>Create Game</button>
    </div>
  )
}

export default Games;
