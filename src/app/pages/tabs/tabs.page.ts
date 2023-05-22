import { Component, EnvironmentInjector, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(public environmentInjector: EnvironmentInjector) {}

  ngOnInit() {}
}
