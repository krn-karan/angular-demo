import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { AdminComponent } from './demo/layout/admin';
import { EmptyComponent } from './demo/layout/empty';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login', // Redirect to login instead of dashboard
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/pages/dashboard/dashboard.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/pages/components/component.module').then((m) => m.ComponentModule)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/pages/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: EmptyComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/auth/auth.module').then((m) => m.AuthModule)
      }
    ]
  },
  // Redirect unknown paths to login
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
