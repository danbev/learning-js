import React, { useState} from 'react';
import './App.css';
import CustomComponent from './CustomComponent';
import UseComponent from './UseEffect';

export const MyContext = React.createContext();

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      { /* allows child components addess the value without having to pass it down as props */}
      <MyContext.Provider value={2}>
        <Counter />
        <CustomComponent name="Dan" age="49" />
        <UseComponent />
      </MyContext.Provider>
    </div>
  );
}

export default App;
