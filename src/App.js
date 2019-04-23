import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import PatientList from "./components/PatientList";

class App extends Component {

  render() {
    return (
      <div className="App">
        <PatientList />
      </div>
    );
  }
}

export default App;
