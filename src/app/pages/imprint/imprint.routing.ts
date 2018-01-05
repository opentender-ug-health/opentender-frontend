import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ImprintPage} from './imprint.component';

const routes: Routes = [
	{path: '', component: ImprintPage}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
