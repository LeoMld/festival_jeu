import './App.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/font-awesome/css/font-awesome.min.css';
import 'assets/scss/argon-design-system-react.scss';

import Axios from 'axios';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './components/navigation/Navigation'
import Home from './views/Home'

function App() {

  Axios.get('/api')
      .then(res => {
        console.log(res.data.response);
      });

  return (
      <div className="App">

          <Navigation/>

          <header className="App-header">
          </header>

          <Switch>
            <Route path="/Accueil" exact component={Home}/>
            <Route path="/"><Redirect to="/Accueil" /></Route>
          </Switch>
      </div>
  );
}

export default App;
