import React from "react";
import "./App.css";
import PeriodicTable from "./PeriodicTable";
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <PeriodicTable />
      </div>
    </ThemeProvider>
  );
}

export default App;