import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ShellComponent } from './app/shell/shell'; // ajuste o caminho se necessário
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(ShellComponent, appConfig)
  .catch(err => console.error(err))
    providers: [provideHttpClient()];
