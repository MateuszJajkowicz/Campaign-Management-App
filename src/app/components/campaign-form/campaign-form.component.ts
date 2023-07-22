import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, catchError, map, of, startWith } from 'rxjs';
import { EMPTY } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Campaign } from 'src/app/models/campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { EmeraldAccountService } from 'src/app/services/emerald-account.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteTrigger,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { getErrorMessage } from 'src/app/utils/getErrorMessage';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  private emeraldAccountBalanceSubscription: Subscription | undefined;
  title = 'Create Cew Campaign';
  campaignForm: FormGroup | null = null;
  isEditMode = false;
  campaignId: number | undefined;
  campaign: Campaign | undefined;
  emeraldAccountBalance = 0;
  isCamapignLoading = false;
  isBalanceLoading = false;
  errorMessage: string = '';
  towns: string[] = ['Town A', 'Town B', 'Town C'];
  filteredKeywords: Observable<string[]> | undefined;
  allKeywords: string[] = ['car', 'house', 'book'];
  selectedKeywords: string[] = [];
  keywordCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  config: MatSnackBarConfig = {
    duration: 5000,
  };
  keywordUpdate$ = new Subject<string>();

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger | null =
    null;
  @ViewChild('keywordInput') keywordInput: ElementRef<HTMLInputElement> | null =
    null;

  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private emeraldAccountService: EmeraldAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmeraldAccountBalance();
    this.route.params.subscribe((params) => {
      this.campaignId = +params['id'];
      if (this.campaignId) {
        this.title = 'Edit Campaign';
        this.isEditMode = true;
        this.retrieveCampaign();
      }
    });
    this.keywordUpdate$.subscribe((value: string) => {
      this.updateFilteredKeywords(value);
    });
  }

  ngOnDestroy(): void {
    if (this.emeraldAccountBalanceSubscription) {
      this.emeraldAccountBalanceSubscription.unsubscribe();
    }
  }

  getEmeraldAccountBalance(): void {
    this.isBalanceLoading = true;
    this.emeraldAccountBalanceSubscription = this.emeraldAccountService
      .getEmeraldAccountBalance()
      .pipe(
        catchError((error) => {
          this.errorMessage = getErrorMessage(error);
          return EMPTY;
        })
      )
      .subscribe((emeraldAccountBalance: number) => {
        this.emeraldAccountBalance = emeraldAccountBalance;
        this.createForm();
        this.isBalanceLoading = false;
        this.cdr.detectChanges();
      });
  }

  createForm(): void {
    const maxCampaignFund = this.emeraldAccountBalance || 0;
    this.campaignForm = this.formBuilder.group({
      name: ['', Validators.required],
      keywords: new FormControl([]),
      bidAmount: ['', [Validators.required, Validators.min(0)]],
      campaignFund: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(maxCampaignFund),
        ],
      ],
      status: ['', Validators.required],
      town: ['', Validators.required],
      radius: ['', Validators.required],
    });

    this.filteredKeywords = this.campaignForm.controls[
      'keywords'
    ].valueChanges.pipe(
      startWith(''),
      map((value: string | string[]) => {
        if (Array.isArray(value)) {
          return value[0].toLowerCase();
        } else {
          return value.toLowerCase();
        }
      }),
      map((value) => this.filterKeywords(value))
    );
  }

  private filterKeywords(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allKeywords.filter(
      (keyword) =>
        keyword.toLowerCase().includes(filterValue) &&
        !this.selectedKeywords.includes(keyword)
    );
  }

  private updateFilteredKeywords(value: string): void {
    const filteredKeywords = this.filterKeywords(value);
    this.filteredKeywords = of(filteredKeywords);
  }

  private retrieveCampaign() {
    this.isCamapignLoading = true;
    this.campaignService
      .getCampaignById(this.campaignId!)
      .pipe(
        catchError((error) => {
          this.errorMessage = getErrorMessage(error);
          return EMPTY;
        })
      )
      .subscribe((campaign) => {
        this.campaign = campaign;
        this.populateForm();
        this.isCamapignLoading = false;
        this.cdr.detectChanges();
      });
  }

  private populateForm(): void {
    const [firstKeyword, ...restKeywords] = this.campaign!.keywords;
    this.selectedKeywords = this.campaign!.keywords;

    this.campaignForm?.patchValue({
      name: this.campaign?.name,
      keywords: [
        firstKeyword,
        ...restKeywords.map((keyword) => keyword.padStart(keyword.length + 1)),
      ],
      bidAmount: this.campaign?.bidAmount,
      campaignFund: this.campaign?.campaignFund,
      status: this.campaign?.status,
      town: this.campaign?.town,
      radius: this.campaign?.radius,
    });
    this.cdr.detectChanges();
  }

  remove(keyword: string): void {
    const index = this.selectedKeywords.indexOf(keyword);

    if (index >= 0) {
      this.selectedKeywords.splice(index, 1);
    }

    this.keywordUpdate$.next('');
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;

    this.selectedKeywords.push(value);
    this.keywordCtrl.setValue(null);
    this.trigger?.closePanel();

    this.keywordUpdate$.next('');
  }

  onSubmit(): void {
    if (this.campaignForm?.invalid) {
      return;
    }

    const campaign: Campaign = this.campaignForm?.value;
    campaign.keywords = this.selectedKeywords;

    if (this.isEditMode) {
      campaign.id = this.campaignId;
      this.processCampaign(
        this.campaignService.updateCampaign(campaign),
        'Campaign updated successfully.'
      );
    } else {
      this.processCampaign(
        this.campaignService.createCampaign(campaign),
        'Campaign created successfully.'
      );
    }
  }

  private processCampaign(
    campaignObservable: Observable<Campaign>,
    successMessage: string
  ): void {
    campaignObservable
      .pipe(
        catchError((error) => {
          this.errorMessage = getErrorMessage(error);
          return EMPTY;
        })
      )
      .subscribe((campaign) => {
        this.updateEmeraldAccountBalance(campaign.campaignFund);
        this.snackBar.open(successMessage, 'Close', this.config);
        this.router.navigate(['/campaigns']);
      });
  }

  private updateEmeraldAccountBalance(
    campaignFund: number
  ): Observable<number> {
    const previousCampaignFund = this.campaign?.campaignFund || 0;
    const difference = previousCampaignFund - campaignFund;

    if (difference === 0) {
      return of(this.emeraldAccountBalance);
    }

    return this.emeraldAccountService
      .updateEmeraldAccountBalance(difference)
      .pipe(
        catchError((error) => {
          this.errorMessage = getErrorMessage(error);
          return EMPTY;
        })
      );
  }

  cancel(): void {
    this.router.navigate(['/campaigns']);
  }
}
