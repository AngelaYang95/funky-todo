import { useRef, useEffect } from 'react';

const usePrevious = (value: unknown) => {
    const ref = useRef<unknown>();
    useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    },[value]); //this code will run when the value of 'value' changes
    return ref.current;
}

export {usePrevious};