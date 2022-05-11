import { Component, OnInit } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '../store/app.states';
import { increment, decrement } from '../store/counter/counter.actions';
import { getCount } from '../store/counter/counter.selectors';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {
  private count$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public Count$: Observable<number>;

  constructor(private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    this.Count$ = this.store.pipe(
      map(state => getCount(state)),
    );
  }

  public incrementCounter() {
    this.store.dispatch(increment());
  }

  public decrementCounter() {
    this.store.dispatch(decrement());
  }
}
