import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EmeraldAccountService } from './services/emerald-account.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Campaign Management App';
  emeraldAccountBalance$: Observable<number>;

  constructor(private emeraldAccountService: EmeraldAccountService) {
    this.emeraldAccountBalance$ =
      this.emeraldAccountService.getEmeraldAccountBalance();
  }
}
