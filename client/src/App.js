import './assets/css/App.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/font-awesome/css/font-awesome.min.css';
import 'assets/scss/argon-design-system-react.scss';

import Axios from 'axios';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Footer from './components/footer/Footer';

import Home from './views/Home';
import FestivalChoice from "./views/FestivalChoice";
import GameList from "./components/festival/GameList";
import Login from "./views/Login";

function App() {

  Axios.get('/api')
      .then(res => {
        console.log(res.data.response);
      });

  return (
      <div className="App">



          <header className="App-header">
          </header>
          <Navigation typeUser ={1}  />


          <Switch>
            <Route path="/Accueil" exact component={Home}/>
            <Route path="/ChoixFestival" exact component={FestivalChoice}/>
            <Route path="/ListeJeux" exact component={GameList}/>
            <Route path="/login" exact component={Login}/>

            <Route path="/"><Redirect to="/Accueil" /></Route>
          </Switch>

          <Footer/>
      </div>
  );
}

export default App;
