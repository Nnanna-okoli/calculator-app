import { ACTIONS } from './App';

 export default function DigitButton( { dispatch, digit }) {
    return (
    <button
         onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
        {digit}
    </button>
    )
}



//A button that has a digit with an onclick which is calling the add digit function 
// and its passing on the digit we want to add