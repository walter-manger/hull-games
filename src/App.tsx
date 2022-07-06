import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import Game from './components/Game';
import GamePlay from './components/GamePlay';
import NewGame from './components/NewGame';


function App() {
  return (
    <Router>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/games">Games</Link></li>
        <li><Link to="/games/new">New Game</Link></li>
      </ul>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/new" element={<NewGame />} />
        <Route path="/games/:id" element={<Game />} />
        <Route path="/games/:id/play" element={<GamePlay />} />
      </Routes>
    </Router>
  );
}

export default App;
