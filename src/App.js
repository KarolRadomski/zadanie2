import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Form from './pages/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Form />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
