// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { importProvidersFrom } from '@angular/core';
// import { CampaignFormComponent } from './app/components/campaign-form/campaign-form.component';
// import { CampaignListComponent } from './app/components/campaign-list/campaign-list.component';
import { AppComponent } from './app/app.component';
// import { CdkTableModule } from '@angular/cdk/table';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatTableModule } from '@angular/material/table';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AppRoutingModule } from './app/app-routing.module';
// import { ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// const modules = [
//   BrowserModule,
//   ReactiveFormsModule,
//   AppRoutingModule,
//   BrowserAnimationsModule,
//   MatInputModule,
//   MatButtonModule,
//   MatSelectModule,
//   MatIconModule,
//   MatFormFieldModule,
//   MatTableModule,
//   MatAutocompleteModule,
//   MatChipsModule,
//   MatProgressSpinnerModule,
//   MatSnackBarModule,
//   CdkTableModule,
// ];
// const components = [AppComponent, CampaignListComponent, CampaignFormComponent];

bootstrapApplication(AppComponent, {
  providers: [
    [provideRouter(routes)],
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
