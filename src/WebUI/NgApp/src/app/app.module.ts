import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  StoreRouterConnectingModule,
  RouterReducerState,
  RouterState,
} from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TodoComponent } from './todo/todo.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { TokenComponent } from './token/token.component';
import { API_BASE_URL } from './web-api-client';
import { counter, weatherForecast, todo } from './store';
import { environment } from '../environments/environment';

const counterReducer = counter.counterReducers.counterReducer;

const weatherForecastReducer = weatherForecast.weatherForecastReducers.weatherForecastReducer;
const FetchWeatherForecastEffect = weatherForecast.weatherForecastEffects.FetchWeatherForecastEffect;

const todoReducer = todo.todoReducers.todoReducer;
const FetchTodosEffect = todo.todoEffects.FetchTodosEffect;
const CreateTodoEffect = todo.todoEffects.CreateTodoEffect;
const UpdateTodoEffect = todo.todoEffects.UpdateTodoEffect;
const DeleteTodoEffect = todo.todoEffects.DeleteTodoEffect;

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    TodoComponent,
    TokenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    StoreModule.forRoot({
      counter: counterReducer,
      weatherForecast: weatherForecastReducer,
      todo: todoReducer,
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Full,
    }),
    EffectsModule.forRoot([
      FetchWeatherForecastEffect,
      FetchTodosEffect,
      CreateTodoEffect,
      UpdateTodoEffect,
      DeleteTodoEffect,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
