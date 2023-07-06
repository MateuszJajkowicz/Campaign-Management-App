import { Route } from '@angular/router';

import { CampaignListComponent } from './app/components/campaign-list/campaign-list.component';
import { CampaignFormComponent } from './app/components/campaign-form/campaign-form.component';

export const routes: Route[] = [
  {
    path: 'campaigns',
    component: CampaignListComponent,
  },
  {
    path: 'campaigns/new',
    component: CampaignFormComponent,
  },
  {
    path: 'campaigns/:id',
    component: CampaignFormComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/campaigns',
  },
];
