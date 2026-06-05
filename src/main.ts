import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Filmes } from './app/components/filmes/filmes';
import {Header} from './app/components/header/header'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Filmes, Header],
  template: `
    <app-header/>
    <app-filmes/>
  `,
})
export class App {}

bootstrapApplication(App, { providers: [provideHttpClient()] });
