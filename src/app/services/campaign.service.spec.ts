import { CampaignService } from './campaign.service';
import { Campaign } from '../models/campaign';

describe('CampaignService', () => {
  let campaignService: CampaignService;

  beforeEach(() => {
    campaignService = new CampaignService();
  });

  it('should retrieve all campaigns', (done) => {
    campaignService.getCampaigns().subscribe((campaigns: Campaign[]) => {
      expect(campaigns.length).toBe(2);
      done();
    });
  });

  it('should retrieve a campaign by ID', (done) => {
    const campaignId = 1;
    campaignService
      .getCampaignById(campaignId)
      .subscribe((campaign: Campaign) => {
        expect(campaign.id).toBe(campaignId);
        done();
      });
  });

  it('should return an error when retrieving a non-existent campaign by ID', (done) => {
    const campaignId = 100;
    campaignService.getCampaignById(campaignId).subscribe({
      error: (error: Error) => {
        expect(error.message).toBe(`Campaign with ID ${campaignId} not found.`);
        done();
      },
    });
  });

  it('should create a new campaign', (done) => {
    const newCampaign: Campaign = {
      id: 3,
      name: 'Campaign 3',
      keywords: ['phone'],
      bidAmount: 20,
      campaignFund: 800,
      status: 'on',
      town: 'Town B',
      radius: 15,
    };

    campaignService
      .createCampaign(newCampaign)
      .subscribe((campaign: Campaign) => {
        expect(campaign).toEqual(newCampaign);

        campaignService.getCampaigns().subscribe((campaigns: Campaign[]) => {
          expect(campaigns).toContain(newCampaign);
          done();
        });
      });
  });

  it('should update an existing campaign', (done) => {
    const updatedCampaign: Campaign = {
      id: 1,
      name: 'Updated Campaign',
      keywords: ['car', 'house', 'phone'],
      bidAmount: 60,
      campaignFund: 700,
      status: 'off',
      town: 'Town A',
      radius: 5,
    };

    campaignService
      .updateCampaign(updatedCampaign)
      .subscribe((campaign: Campaign) => {
        expect(campaign).toEqual(updatedCampaign);
        done();
      });
  });

  it('should return an error when updating a non-existent campaign', (done) => {
    const nonExistentCampaign: Campaign = {
      id: 100,
      name: 'Non-Existent Campaign',
      keywords: ['book'],
      bidAmount: 30,
      campaignFund: 900,
      status: 'on',
      town: 'Town D',
      radius: 25,
    };

    campaignService.updateCampaign(nonExistentCampaign).subscribe({
      error: (error: Error) => {
        expect(error.message).toBe(
          `Campaign with ID ${nonExistentCampaign.id} not found.`
        );
        done();
      },
    });
  });

  it('should delete a campaign', (done) => {
    const campaignId = 1;
    campaignService.deleteCampaign(campaignId).subscribe(() => {
      campaignService.getCampaigns().subscribe((campaigns: Campaign[]) => {
        expect(
          campaigns.find((campaign) => campaign.id === campaignId)
        ).toBeUndefined();
        done();
      });
    });
  });

  it('should return an error when deleting a non-existent campaign', (done) => {
    const nonExistentCampaignId = 100;
    campaignService.deleteCampaign(nonExistentCampaignId).subscribe({
      error: (error: Error | string) => {
        expect(error).toBe(
          `Campaign with ID ${nonExistentCampaignId} not found.`
        );
        done();
      },
    });
  });
});
