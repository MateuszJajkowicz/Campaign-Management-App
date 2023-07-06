import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Campaign } from 'src/app/models/campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  Observable,
  Subscription,
  catchError,
  switchMap,
} from 'rxjs';
import { EMPTY } from 'rxjs';
import { EmeraldAccountService } from 'src/app/services/emerald-account.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [MatSnackBar],
})
export class CampaignListComponent implements OnInit, OnDestroy {
  private campaignsSubscription: Subscription | undefined;
  campaigns: MatTableDataSource<Campaign> = new MatTableDataSource<Campaign>();
  displayedColumns: string[] = [
    'name',
    'keywords',
    'bidAmount',
    'campaignFund',
    'status',
    'town',
    'radius',
    'actions',
  ];
  isLoading = true;
  errorMessage: string = '';

  config: MatSnackBarConfig = {
    duration: 5000,
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private campaignService: CampaignService,
    private emeraldAccountService: EmeraldAccountService
  ) {}

  ngOnInit(): void {
    this.getCampaigns();
  }

  getCampaigns(): void {
    this.campaignsSubscription = this.campaignService
      .getCampaigns()
      .subscribe((campaigns: Campaign[]) => {
        this.campaigns.data = campaigns.map((campaign) => ({
          ...campaign,
          keywords: [
            campaign.keywords[0],
            ...campaign.keywords
              .slice(1)
              .map((keyword) => keyword.padStart(keyword.length + 1)),
          ],
        }));
        this.isLoading = false;
      });
  }

  editCampaign(id: number): void {
    this.router.navigate(['/campaigns', id]);
  }

  deleteCampaign(campaign: Campaign): void {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this campaign?'
    );
    if (shouldDelete) {
      this.campaignService
        .deleteCampaign(campaign.id!)
        .pipe(
          switchMap(() =>
            this.updateEmeraldAccountBalance(campaign.campaignFund)
          ),
          catchError((error) => {
            console.error('Error deleting campaign:', error);
            this.errorMessage = 'Error deleting campaign. Please try again.';
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.campaigns.data = this.campaigns.data.filter(
            (c) => c !== campaign
          );
          this.snackBar.open(
            'Campaign deleted successfully.',
            'Close',
            this.config
          );
        });
    }
  }

  private updateEmeraldAccountBalance(
    campaignFund: number
  ): Observable<number> {
    return this.emeraldAccountService
      .updateEmeraldAccountBalance(campaignFund)
      .pipe(
        catchError((error) => {
          console.error('Error updating Emerald Account Balance:', error);
          this.errorMessage =
            'Error updating Emerald Account Balance. Please try again.';
          throw error;
        })
      );
  }

  trackByCampaignId(index: number, campaign: Campaign): number {
    return campaign.id!;
  }

  ngOnDestroy(): void {
    if (this.campaignsSubscription) {
      this.campaignsSubscription.unsubscribe();
    }
  }
}
