import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class AccountPage implements OnInit {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });

    await loading.present();

    this.authService.logout().subscribe({
      next: (res) => {
        loading.dismiss();

        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: async (err) => {
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Logout failed: ' + err.error.message,
          buttons: ['OK'],
        });

        await alert.present();
      },
    });
  }
}
