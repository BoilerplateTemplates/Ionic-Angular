import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swiper } from 'swiper';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  hideNavigation = false;

  constructor(
    public platform: Platform,
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit() {
    if (!this.platform.is('ios') && !this.platform.is('android')) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    if (await this.storage.get('hideOnboarding')) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  swiperSlideChanged(e: any) {
    this.hideNavigation = this.swiperRef?.nativeElement.swiper.isEnd;
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  next() {
    this.swiper?.slideNext();
  }

  start() {
    this.storage.set('hideOnboarding', true);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
