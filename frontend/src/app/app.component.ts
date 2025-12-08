import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Removemos o UserListComponent daqui
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'frontend-bancos';
}
