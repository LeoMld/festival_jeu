import './assets/css/App.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/font-awesome/css/font-awesome.min.css';
import 'assets/scss/argon-design-system-react.scss';
import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import { Switch, Route, Redirect } from 'react-router-dom';
import token from "./utils/token"

import { useHistory } from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Footer from './components/footer/Footer';

// Pages of the application
import Home from './views/Home';
import FestivalChoice from "./views/FestivalChoice";
import AllGames from "./views/AllGames";
import Login from "./views/Login";
import Person from "./views/Persons";



function App() {


    const history = useHistory();




    console.log("Le type du token est "+ token.getType())

    /*const checkTypeUser = async ()=>{
        await Axios.get('/api/token',{headers: {
                'Authorization': `${token.getToken()}`
            }} )
            .then(({data}) => {
                console.log("type User actuel" + typeUser)
                console.log(data)
                if(typeUser !== data){
                    setTypeUser(2)
                    return false
                    /!*token.destroyToken()*!/
                }else{
                    return true
                }
            }).catch(e => {
            console.log(e)
        })

    }*/


    useEffect(()=>{
        console.log("j'active le useEffect")

    })

  return (
      <div className="App">

          <header className="App-header">
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
          </header>

          <Navigation history ={history}  />
          <Switch>
            <Route path="/Accueil" exact component={Home}/>
              {token.getType() !== 2?
                  <Route path="/ChoixFestival" exact component={FestivalChoice}/>
                  :
                  <Route path="/ChoixFestival" exact><Redirect to="/Connexion" /></Route>
              }

            <Route path="/ListeJeux" exact component={AllGames}/>
            <Route path="/Editeurs" exact component={ (props)=>
                <Person {...props} type={1}/>
            }/>


              { token.getType() !== 2 ?
                  <Route path="/Connexion" exact><Redirect to="/Accueil" /></Route>
                  :
                  <Route path="/Connexion" exact component={(props) => <Login />}/>
              }



              <Route path="/"><Redirect to="/Accueil" /></Route>
          </Switch>

          <Footer/>
      </div>
  );
}

export default App;
