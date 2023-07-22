import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CampaignFormComponent } from './campaign-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { CampaignService } from 'src/app/services/campaign.service';
import { EmeraldAccountService } from 'src/app/services/emerald-account.service';
import { of } from 'rxjs';
import { Campaign } from 'src/app/models/campaign';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

describe('CampaignFormComponent', () => {
  let component: CampaignFormComponent;
  let fixture: ComponentFixture<CampaignFormComponent>;
  let campaignService: CampaignService;
  let emeraldAccountService: EmeraldAccountService;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CampaignFormComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule,
      ],
      providers: [
        FormBuilder,
        CampaignService,
        EmeraldAccountService,
        MatSnackBar,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignFormComponent);
    component = fixture.componentInstance;
    campaignService = TestBed.inject(CampaignService);
    emeraldAccountService = TestBed.inject(EmeraldAccountService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    spyOn(campaignService, 'createCampaign').and.returnValue(
      of({ id: 3 } as Campaign)
    );
    spyOn(campaignService, 'updateCampaign').and.returnValue(
      of({} as Campaign)
    );
    spyOn(emeraldAccountService, 'getEmeraldAccountBalance').and.returnValue(
      of(2000)
    );
    spyOn(snackBar, 'open').and.stub();
    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    fixture.detectChanges();

    expect(component.campaignForm).toBeTruthy();
    expect(component.title).toBe('Create Cew Campaign');
    expect(component.isEditMode).toBeFalse();
  });

  it('should mark form controls as invalid when empty form is submitted', () => {
    component.onSubmit();
    expect(component.campaignForm?.invalid).toBeTrue();
    expect(component.campaignForm?.get('name')?.invalid).toBeTrue();
    expect(component.campaignForm?.get('bidAmount')?.invalid).toBeTrue();
    expect(component.campaignForm?.get('campaignFund')?.invalid).toBeTrue();
    expect(component.campaignForm?.get('status')?.invalid).toBeTrue();
    expect(component.campaignForm?.get('town')?.invalid).toBeTrue();
    expect(component.campaignForm?.get('radius')?.invalid).toBeTrue();
  });

  it('should call createCampaign method when form is submitted in create mode', () => {
    component.isEditMode = false;
    component.campaignForm?.patchValue({
      name: 'Test Campaign',
      keywords: ['keyword1', 'keyword2'],
      bidAmount: 100,
      campaignFund: 500,
      status: 'on',
      town: 'Town A',
      radius: 10,
    });
    const snackBarOpenSpy = spyOn(component['snackBar'], 'open');

    component.onSubmit();

    expect(campaignService.createCampaign).toHaveBeenCalledWith({
      name: 'Test Campaign',
      keywords: component.selectedKeywords,
      bidAmount: 100,
      campaignFund: 500,
      status: 'on',
      town: 'Town A',
      radius: 10,
    });
    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'Campaign created successfully.',
      'Close',
      component.config
    );
    expect(router.navigate).toHaveBeenCalledWith(['/campaigns']);
  });

  it('should call updateCampaign method when form is submitted in edit mode', () => {
    component.isEditMode = true;
    component.campaignId = 1;
    component.campaignForm?.patchValue({
      name: 'Test Campaign',
      keywords: ['keyword1', 'keyword2'],
      bidAmount: 100,
      campaignFund: 500,
      status: 'on',
      town: 'Town A',
      radius: 10,
    });
    const snackBarOpenSpy = spyOn(component['snackBar'], 'open');

    component.onSubmit();

    expect(campaignService.updateCampaign).toHaveBeenCalledWith({
      id: 1,
      name: 'Test Campaign',
      keywords: component.selectedKeywords,
      bidAmount: 100,
      campaignFund: 500,
      status: 'on',
      town: 'Town A',
      radius: 10,
    });
    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'Campaign updated successfully.',
      'Close',
      component.config
    );
    expect(router.navigate).toHaveBeenCalledWith(['/campaigns']);
  });

  it('should navigate to "/campaigns" when cancel button is clicked', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/campaigns']);
  });
});
