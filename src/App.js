import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login'
import { useStateProviderValue } from "./StateProvider";

function App() {

  const [{ user }, dispatch] = useStateProviderValue();
  
  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId" component={Chat} />
              {/* <Route path="/" component ={Sidebar} /> */}
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
