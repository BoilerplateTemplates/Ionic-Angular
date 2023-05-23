import { Component, EnvironmentInjector } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { SplashScreen } from '@capacitor/splash-screen';
import { register } from 'swiper/element/bundle';
import { Platform } from '@ionic/angular';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    public environmentInjector: EnvironmentInjector
  ) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();

    await SplashScreen.hide();
  }
}
