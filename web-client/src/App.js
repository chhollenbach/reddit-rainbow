import './App.css';
import React, {useState} from 'react';
import RainbowColorBox from './components/RainbowColorBox'
import 'bulma/css/bulma.min.css'
import About from './components/About'
import InfoPanel from './components/InfoPanel'

function App() {
  const [infoVisible, setVisibility] = useState(false);
  const [selectedColor, setColor] = useState('');

  function toggleInfoPanel(col) {
    setVisibility(true)
    setColor(col)
  }

  return (
      <div className="App">
        <header className="App-header">The Rainbow in Reddit</header>
        <div className="columns">
          <RainbowColorBox onClick={toggleInfoPanel} color="Red"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Orange"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Yellow"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Green"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Blue"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Indigo"/>
          <RainbowColorBox onClick={toggleInfoPanel} color="Violet"/>
        </div>
        <InfoPanel visible={infoVisible} color={selectedColor}/>
        <About/>
      </div>

  );
}

export default App;
