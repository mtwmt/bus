import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Configuration {
  baseUrl: string;
  assetsUrl: string;
  apiUrl: string;
  services: { [key: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configuration$!: Observable<Configuration>;
  private appConfig!: Configuration;

  constructor(private handler: HttpBackend) {}

  public loadConfigurations(): any {
    return () => {
      return new Promise((resolve, reject) => {
        this.configuration$ = new HttpClient(this.handler)
          .get<Configuration>(environment.configPath)
          .pipe(
            shareReplay(1),
            tap((data) => {
              this.appConfig = data;
            })
          );
        return resolve(this.configuration$.subscribe());
      });
    };
  }

  get config() {
    return this.appConfig;
  }
}
