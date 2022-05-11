import { createAction, props } from '@ngrx/store';

const actionPrefix = '[Counter]';

export class CounterActionTypes {
  public static readonly Increment = `${actionPrefix} Increment`;
  public static readonly IncrementBy = `${actionPrefix} Increment By`;
  public static readonly Decrement = `${actionPrefix} Decrement`;
  public static readonly DecrementBy = `${actionPrefix} Decrement By`;
  public static readonly Reset = `${actionPrefix} Reset`;
}

export const increment = createAction(CounterActionTypes.Increment);
export const incrementBy = createAction(CounterActionTypes.IncrementBy, props<{ by: number }>());
export const decrement = createAction(CounterActionTypes.Decrement);
export const decrementBy = createAction(CounterActionTypes.DecrementBy, props<{ by: number }>());
export const reset = createAction(CounterActionTypes.Reset);
