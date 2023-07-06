import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmeraldAccountService {
  private emeraldAccountBalance: BehaviorSubject<number>;

  constructor() {
    this.emeraldAccountBalance = new BehaviorSubject<number>(1000);
  }

  getEmeraldAccountBalance(): Observable<number> {
    return this.emeraldAccountBalance.asObservable().pipe(delay(500));
  }

  updateEmeraldAccountBalance(campaignFund: number): Observable<number> {
    const currentBalance = this.emeraldAccountBalance.getValue();
    const updatedBalance = currentBalance + campaignFund;
    this.emeraldAccountBalance.next(updatedBalance);
    return of(updatedBalance);
  }
}
