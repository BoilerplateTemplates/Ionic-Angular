import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onSubmit() {
    const { email, password } = this.loginForm.getRawValue();

    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });

    await loading.present();

    this.authService.login(email, password).subscribe({
      next: (res) => {
        loading.dismiss();

        this.router.navigateByUrl('/app', { replaceUrl: true });
      },
      error: async (err) => {
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Login failed: ' + err.error.msg,
          buttons: ['OK'],
        });

        await alert.present();
      },
    });
  }
}
