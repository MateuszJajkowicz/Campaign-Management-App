import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CampaignListComponent } from './campaign-list.component';
import { CampaignService } from 'src/app/services/campaign.service';
import { EmeraldAccountService } from 'src/app/services/emerald-account.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { Campaign } from 'src/app/models/campaign';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CampaignListComponent', () => {
  let component: CampaignListComponent;
  let fixture: ComponentFixture<CampaignListComponent>;
  let campaignService: CampaignService;
  let emeraldAccountService: EmeraldAccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CampaignListComponent,
        RouterTestingModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [CampaignService, EmeraldAccountService, MatSnackBar],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListComponent);
    component = fixture.componentInstance;
    campaignService = TestBed.inject(CampaignService);
    emeraldAccountService = TestBed.inject(EmeraldAccountService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch campaigns on component initialization', () => {
    const campaigns: Campaign[] = [
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

    spyOn(campaignService, 'getCampaigns').and.returnValue(of(campaigns));

    component.ngOnInit();

    expect(campaignService.getCampaigns).toHaveBeenCalled();
    expect(component.campaigns.data).toEqual(
      campaigns.map((campaign) => ({
        ...campaign,
        keywords: [
          campaign.keywords[0],
          ...campaign.keywords
            .slice(1)
            .map((keyword) => keyword.padStart(keyword.length + 1)),
        ],
      }))
    );
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to campaign edit page when editCampaign is called', () => {
    const campaignId = 1;
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.editCampaign(campaignId);

    expect(navigateSpy).toHaveBeenCalledWith(['/campaigns', campaignId]);
  });

  it('should delete campaign when deleteCampaign is called', () => {
    const campaign: Campaign = {
      id: 1,
      name: 'Campaign 1',
      keywords: ['car', 'house'],
      bidAmount: 50,
      campaignFund: 500,
      status: 'on',
      town: 'Town A',
      radius: 10,
    };

    const deleteCampaignSpy = spyOn(
      campaignService,
      'deleteCampaign'
    ).and.returnValue(of(undefined));

    const updateEmeraldAccountBalanceSpy = spyOn(
      component as any,
      'updateEmeraldAccountBalance'
    ).and.returnValue(of(undefined));

    const snackBarOpenSpy = spyOn(component['snackBar'], 'open');

    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteCampaign(campaign);

    expect(deleteCampaignSpy).toHaveBeenCalledWith(campaign.id!);
    expect(updateEmeraldAccountBalanceSpy).toHaveBeenCalledWith(
      campaign.campaignFund
    );
    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'Campaign deleted successfully.',
      'Close',
      component.config
    );
  });
});
