import { EmeraldAccountService } from './emerald-account.service';

describe('EmeraldAccountService', () => {
  let emeraldAccountService: EmeraldAccountService;

  beforeEach(() => {
    emeraldAccountService = new EmeraldAccountService();
  });

  it('should retrieve the emerald account balance', (done) => {
    const initialBalance = 1000;
    emeraldAccountService
      .getEmeraldAccountBalance()
      .subscribe((balance: number) => {
        expect(balance).toBe(initialBalance);
        done();
      });
  });

  it('should update the emerald account balance', (done) => {
    const campaignFund = 500;
    const initialBalance = 1000;
    const expectedBalance = initialBalance + campaignFund;

    emeraldAccountService
      .updateEmeraldAccountBalance(campaignFund)
      .subscribe((balance: number) => {
        expect(balance).toBe(expectedBalance);

        emeraldAccountService
          .getEmeraldAccountBalance()
          .subscribe((updatedBalance: number) => {
            expect(updatedBalance).toBe(expectedBalance);
            done();
          });
      });
  });
});
