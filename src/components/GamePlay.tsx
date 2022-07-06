import { useEffect, useState } from 'react'
import {
  useParams
} from 'react-router-dom'
import { useObject } from 'react-firebase-hooks/database';
import { ref, getDownloadURL, list } from "firebase/storage";
import { ref as dbref } from "firebase/database";
import { db, storage } from '../services/firebase';
import { Game, Player, Selection } from '../types';


// type Player = {
//   id: string,
//   name: string,
// };

// type Selection = {
//   user?: Player,
//   id?: string,
//   imgUrl?: string,
//   description?: string,
// };

function GamePlay() {
  let { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [selection, setSelection] = useState<Selection>({});
  const [snapshot, loading, error] = useObject(dbref(db, `games/${id}`));

  useEffect(() => {
    listImages();
    listPlayers();
  }, []);

  if (!id) return <div />;

  const user: Player = { id: '5', name: 'Willie Nelson' };
    const listStorageRef = ref(storage, `games/${id}`);
  const listImages = async (pageToken: string = '') => {
    const c = [];
    const res = await list(listStorageRef, { maxResults: 1, pageToken });

    if (res.items.length > 0) {
      const url = await getDownloadURL(res.items[0]);
      c.push(url);
      setImages(c);
      setNextPageToken(res.nextPageToken ?? '');
      setSelection({ user, imgUrl: url });
    }
  };

  const listPlayers = async () => {
    const users: Player[] = [
      { id: '1', name: 'Fred Johnson' },
      { id: '2', name: 'John Glum' },
      { id: '3', name: 'Ez Blummer' },
      { id: '4', name: 'Stiff Blitzer' },
      { id: '5', name: 'Willie Nelson' },
    ]
    setPlayers(users.filter((u) => u.id !== user.id));
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`submit ${JSON.stringify(selection)}`);
    setSelection({});
    listImages(nextPageToken)
  }

  return (
    <div>

      { snapshot && <span>VAL: {JSON.stringify(snapshot.val())}</span> }


      <h2>Game Details</h2>

      { snapshot?.val() && Object.keys(snapshot.val()?.cards).length > 0 && (
        <div>
        <h3>Yay</h3>
        {snapshot?.val()?.cards && Object.keys(snapshot?.val()?.cards)?.map((card: any) => <h4 key={card}>{card}</h4>)}
        </div>
      )}

      {images && images.length > 0 && (
        <div>
          <div>
            {images.map((img) => <img key={img} src={img} alt='uploaded file' style={{ maxWidth: '600px', maxHeight: '600px' }} />)}
          </div>

          {players && (
            <form onSubmit={handleSubmit} className='form'>
              <div>
                {players.map((player) => (
                  <div key={player.id}>
                    <input
                      name='player'
                      id={`${player.id}`}
                      type='radio'
                      value={player.id}
                      checked={selection && selection.id === player.id}
                      onChange={() => setSelection(Object.assign({}, selection || {}, { id: player.id }))} />
                    <label htmlFor={`${player.id}`}>{player.name}</label>
                  </div>
                ))}
                <label htmlFor='describe'>What is it? </label>
                <input id='describe' name="describe" onChange={(e) => setSelection(Object.assign({}, selection || {}, { description: e.target.value }))} value={selection && selection.description || ''} />
              </div>
              <button type="submit" disabled={!selection?.description || !selection?.id}>Vote</button>
            </form>
          )}

        </div>
      )}
    </div>
  )
}

export default GamePlay;
