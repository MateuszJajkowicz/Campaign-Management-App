import { Injectable } from '@angular/core';
import { Campaign } from '../models/campaign';
import { Observable, delay, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private campaigns: Campaign[] = [];

  constructor() {
    this.campaigns = [
      {
        id: 1,
        name: 'Campaign 1',
        keywords: ['car', 'house'],
        bidAmount: 50,
        campaignFund: 500,
        status: 'on',
        town: 'Town A',
        radius: 10,
      },
      {
        id: 2,
        name: 'Campaign 2',
        keywords: ['book'],
        bidAmount: 10,
        campaignFund: 1000,
        status: 'off',
        town: 'Town C',
        radius: 20,
      },
    ];
  }

  getCampaigns(): Observable<Campaign[]> {
    return of(this.campaigns).pipe(delay(500));
  }

  getCampaignById(campaignId: number): Observable<Campaign> {
    const foundCampaign = this.campaigns.find(
      (campaign) => campaign.id === campaignId
    );

    if (foundCampaign) {
      return of(foundCampaign).pipe(delay(500));
    } else {
      return throwError(
        () =>
          new Error(
            `Error getting campaign. Campaign with ID ${campaignId} not found.`
          )
      );
    }
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    const newId = this.generateNewId();
    campaign.id = newId;
    this.campaigns.push(campaign);
    return of(campaign);
  }

  updateCampaign(campaign: Campaign): Observable<Campaign> {
    const index = this.campaigns.findIndex((c) => c.id === campaign.id);
    if (index !== -1) {
      this.campaigns[index] = campaign;
      return of(campaign);
    }
    return throwError(
      () =>
        new Error(
          `Error updating campaign. Campaign with ID ${campaign.id} not found.`
        )
    );
  }

  deleteCampaign(id: number): Observable<void> {
    const index = this.campaigns.findIndex((campaign) => campaign.id === id);
    if (index !== -1) {
      this.campaigns.splice(index, 1);
      return of(undefined);
    }
    return throwError(
      () => `Error deleting campaign. Campaign with ID ${id} not found.`
    );
  }

  private generateNewId(): number {
    return new Date().getTime();
  }
}
