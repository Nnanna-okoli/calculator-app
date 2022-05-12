import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OpertationButton';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERTATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      // if 0 or . is clicked return the current state thus 0 or . should not appear more than once for currentoperand
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      } 

      return {
        ...state,
        currentOperand: `${state.currentOperand || "" }${payload.digit}`
      }

      case ACTIONS.CHOOSE_OPERTATION:
      if(state.currentOperand == null && state.previousOperand == null) {
           return state
      } 
      
      //overwrites the operation - meaning operation button can be replaced after clicked
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // below basically the currentOperand becomes our previous and the operation is saved 
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }      

      //taking current and previous op calculating the operation fromt the evaluate then setting result into the previous op state
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
      //Actions.clear returns an empty state clearing previous state when AC is clicked 
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        } 
        if (state.currentOperand == null ) return state
        if (state.currentOperand.length === 1 ) {
          return { ...state, currentOperand: null }
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1) //removes last digit from current operand
        }
      case ACTIONS.EVALUATE:
        if (
          state.operation == null || 
          state.currentOperand == null || 
          state.previousOperand == null
          ) {
            return state
          }

          return {
            ...state,
            overwrite: true,
            previousOperand: null,
            operation: null,
            currentOperand: evaluate(state)
          }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  //below carries out the calculations 
  switch (operation) {
    case "+":
      computation = prev + current
      break // to stop calculation going into next case statement
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

//seperates interger portion and non integer portion meaning no formatting occurs once . has been clicked
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
}) 

//this will format the integers 
function formatOperand(operand) {
  if(operand == null) return 
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}` //no formatting on the decimal 
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer, 
    {}
    )


  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two'  onClick={() => dispatch({type: ACTIONS.EVALUATE })}>=</button>
    </div>
  )
}

export default App
