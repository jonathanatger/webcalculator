import React from 'react';
import './App.css';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk'
import {create, all} from 'mathjs' 
const config = { }
const math = create(all, config);

/* TODO
restart after a result

*/




//Redux--------------------------------
const DIGIT = "digit";
const OPERATOR = "operator";
const RESULT = "input";
const CLEAR = "delete";

const initialState = {
  formula: "0",
  input: "0"
};


//action creator
const actionCreator = function (type, keyValue) {
  const _action = {
    type: type,
    keyValue: keyValue
  };
  return _action;
};



//functions for Reducer to perform to achieve update

const updateInput = function (input, keyValue) {
  if(typeof input != "string" ){input = input.toString()}
  let _input;
  if(input != 0 && input.includes(".")){
    if(keyValue != "."){
      _input = input + keyValue;
    } else {_input = input}
  } else if (input != 0){
    _input = input + keyValue;
  }else{  
    _input = keyValue;
  }
  return _input;
};

const updateFormula = function (formula, keyValue, input) {
  let _formula;
  if(formula == "0"){return input + keyValue}
  let reg = /\d+[+|-|*]$/i;
  if(reg.test(formula)){_formula = formula.slice(0, formula.length ) + input + keyValue }
    else {_formula = formula + keyValue + input} 
  return _formula;
};

const executeFormula = function (formula) {
  
  const _res = math.evaluate(formula);
  return _res.toString();
};

//Reducer for store
const formulaReducer = (state = initialState, action) => {
  switch (action.type) {
    case DIGIT:
      const currentInput = updateInput(
        state.input,
        action.keyValue
      );
      return { formula: state.formula, input: currentInput};
    
    case OPERATOR:
      const currentFormula2 = updateFormula(
        state.formula,
        action.keyValue,
        state.input
      );
      return { formula: currentFormula2, input: "0" };

    case RESULT:
      const currentFormula3 = state.formula + state.input
      const currentinput = executeFormula(currentFormula3);
      return { formula: "0", input: currentinput };

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};

//Define store and AppWrapper
const store = createStore(formulaReducer);


export default class AppWrapper extends React.Component {
  render() {
    return(
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}



//React--------------------------------

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="app">
        <ConnectedScreen />
        <ConnectedControls/>
      </div>
      );
  }
  //end of App
}


class Screen extends React.Component {
  constructor(props) {
    super(props);
    
  }



  render() {
    return (
      <div id='screen'>
        <h2>{this.props.formattedFormula}</h2>
        <h1 id="lowerDisplay">{this.props.currentInput}</h1>
      </div>
    )
  }
}

//ReactRedux for the screen
const mapStateToProps = (state) => {
  return { formattedFormula : state.formula,
  currentInput : state.input }
};


const ConnectedScreen = connect(mapStateToProps, null)(Screen)

//Controls component : Buttons in the calculator
class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.colorSwitch = this.colorSwitch.bind(this);
  }

  colorSwitch = function(event){

  }

  

  render() {
    const digits = [];
    for(let i = 1; i<=9; i++){
      digits.push(
      <button className="digit-btn" id={i.toString()} onClick={this.colorSwitch, () => this.props.dispDigit(i)}> {i} </button>
    );    
  };



    digits.push(<button className="digit-btn double-btn" id={"0"} onClick={() => this.props.dispDigit("0")}> 0 </button>)
    digits.push(<button className="digit-btn" onClick={() => this.props.dispDigit(".")}> . </button>)

    return (
      <div id='controls'>
        <div id="operators" className="controlpanel">
          <button className="operator-btn" id={"+"} onClick={() => this.props.dispOperator("+")}> {"+"} </button>
          <button className="operator-btn" onClick={() => this.props.dispOperator("*")}> {"*"} </button>
          <button className="operator-btn" onClick={() => this.props.dispOperator("-")}> {"-"} </button>
          <button className="operator-btn" onClick={() => this.props.dispOperator("/")}> {"/"} </button>
        </div>
        <div id="digits" className="controlpanel">
          {digits}
        </div>
        <div id="util" className="controlpanel">
          <button className="operator-btn" onClick={() => this.props.execute()}> = </button>
          <button className="operator-btn" onClick={() => this.props.clear()}> CLEAR </button>
        </div>
      </div>
    )
  }
}

//ReactRedux for Controls
const mapDispatchToState = (dispatch) => {
  return {
    dispDigit : (keyValue) => {
      dispatch(actionCreator(DIGIT, keyValue))
    },
    dispOperator: (keyValue) => {
      dispatch(actionCreator(OPERATOR, keyValue))
    },
    execute : () => {
      dispatch(actionCreator(RESULT, ""))
    },
    clear : () => {
      dispatch(actionCreator(CLEAR, ""))
    }
}
}

const ConnectedControls = connect(null, mapDispatchToState)(Controls);

