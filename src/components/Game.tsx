import { useEffect, useState } from 'react'
import {
  useParams
} from 'react-router-dom'
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { db, storage } from '../services/firebase';
import { ref as dbref, runTransaction } from 'firebase/database';


function Game() {
  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    listImages();
  }, []);


  let { id } = useParams();
  if (!id) return <div />;
  const gameRef = dbref(db, `/games/${id}`);
  const listStorageRef = ref(storage, `games/${id}`);

  const listImages = async () => {
    const c = [];
    const res = await listAll(listStorageRef);
    for (const imgRef of res.items) {
      const url = await getDownloadURL(imgRef);
      c.push(url);
    }
    setImages(c);
  };


  const deleteImage = (url: string) => {
    console.log(`deleting ${url}`);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];

    if (!file) return;

    const filename = Math.floor(Date.now() / 1000);
    const storageRef = ref(storage, `games/${id}/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setProgresspercent(progress);
    }, (error) => {
      alert(error);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setImgUrl(downloadUrl)
        runTransaction(gameRef, (game) => {
          if (game['cards']) {
            game.cards = Object.assign({}, game.cards || {}, { [filename]: { votes: { default: 'none' } }});
          } else {
            game.cards = { [filename]: { votes: { default: 'none' } }};
          }
          return game;
        });
      });
      listImages();
    });
  }

  return (
    <div>
      <h2>Game Details</h2>
      <p>{ id }</p>

      <form onSubmit={handleSubmit} className='form'>
        <input type='file' />
        <button type='submit'>Upload</button>
      </form>

    { !imgUrl && (
      <div className='outerbar'>
        <div className='innerBar' style={{ width: `${progresspercent}%` }}>{ progresspercent }</div>
      </div>
    ) }

    { images && (
      <ul>
        { images.map((img) => <li key={img}><img src={img} alt='uploaded file' height={200} /></li>) }
      </ul>
    ) }

    </div>
  )
}

export default Game;
