import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class RegisterPage implements OnInit {
  registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
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
    const { name, email, password } = this.registerForm.getRawValue();

    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });

    await loading.present();

    this.authService.register(name, email, password).subscribe({
      next: (res) => {
        loading.dismiss();

        this.router.navigateByUrl('/app', { replaceUrl: true });
      },
      error: async (err) => {
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Registration failed: ' + err.error.message,
          buttons: ['OK'],
        });

        await alert.present();
      },
    });
  }
}
