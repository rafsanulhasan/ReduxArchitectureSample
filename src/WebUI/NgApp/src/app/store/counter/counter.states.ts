export const counterStateKey = 'counter';

export interface CounterFeatureState {
  count: number;
}

export const initialCount = 0;

export const initialCounterState: CounterFeatureState = {
  count: initialCount,
};
