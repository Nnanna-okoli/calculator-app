import { ACTIONS } from './App';

 export default function OperationButton( { dispatch, operation }) {
    return (
    <button
         onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERTATION, payload: { operation } })}
    >
        {operation}
    </button>
    )
}



//A button that has a digit with an onclick which is calling the add digit function 
// and its passing on the digit we want to add