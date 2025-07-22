import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ShellComponent } from './app/shell/shell'; // ajuste o caminho se necessário
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(ShellComponent, appConfig)
  .catch(err => console.error(err))
    providers: [
    provideRouter(routes),
    provideHttpClient() // ← Adicione esta linha
  ]
