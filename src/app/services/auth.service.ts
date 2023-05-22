import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, switchMap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Router, UrlTree } from '@angular/router';

import { API_URL, USER_APP_TOKEN } from './constants';
import { Device } from '@capacitor/device';

export interface DeviceData {
  id: string;
}

export interface UserData {
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private device: BehaviorSubject<DeviceData> = new BehaviorSubject<DeviceData>(
    { id: 'IonicDefault' }
  );
  private user: BehaviorSubject<UserData | null | undefined> =
    new BehaviorSubject<UserData | null | undefined>(undefined);

  constructor(private http: HttpClient, private storage: Storage) {
    this.loadDevice();
    this.loadUser();
  }

  async loadDevice() {
    const deviceId = await Device.getId();

    if (deviceId) {
      this.device.next({
        id: deviceId.identifier,
      });
    }
  }

  async loadUser() {
    const data = await this.storage.get(USER_APP_TOKEN);

    if (data) {
      const decoded: any = data.split('|');

      const userData = {
        token: data,
        id: decoded[0],
      };

      this.user.next(userData);
    } else {
      this.user.next(null);
    }
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      })
      .pipe(
        switchMap((user) => {
          return this.login(email, password);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(`${API_URL}/auth/login`, {
        email,
        password,
        deviceId: this.device.value.id,
      })
      .pipe(
        map((res: any) => {
          this.storage.set(USER_APP_TOKEN, res.token);

          const decoded: any = res.token.split('|');

          const userData = {
            token: res.token,
            id: res.decoded,
          };

          this.user.next(userData);

          return userData;
        })
      );
  }

  logout() {
    return this.http
      .delete(`${API_URL}/auth/logout`, {
        body: {
          deviceId: this.device.value.id,
        },
      })
      .pipe(
        map((res: any) => {
          this.storage.remove(USER_APP_TOKEN);
          this.user.next(null);
        })
      );
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    return this.user.getValue()!.id;
  }

  isLoggedIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          return router.createUrlTree(['/']);
        }
      })
    );
  }

  shouldLogin(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return router.createUrlTree(['/app']);
        } else {
          return true;
        }
      })
    );
  }
}
