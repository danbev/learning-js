//import React, { Component, useContext } from 'react';
import React, { useContext } from 'react';
import { MyContext} from './App.js';

/*
// Class component
class CustomComponent extends Component {
  render() {
    const value = useContext(MyContext);
    return <div>Hello, {this.props.name} age: {this.props.age}, value: {value}!</div>;
  }
}
*/

const CustomComponent = (props) => {
  const value = useContext(MyContext);
  return (
    <div>
      Hello, {props.name}, age: {props.age}, value: {value}!
    </div>
  );
};

export default CustomComponent;
