import { Navigation } from 'src/app/@theme/types/navigation';

export const menus: Navigation[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: '#custom-status-up'
      }
    ]
  },
  {
    id: 'auth',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Login',
        title: 'Login',
        type: 'item',
        classes: 'nav-item',
        url: '/auth/login',
        icon: '#custom-shield',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Register',
        type: 'item',
        classes: 'nav-item',
        url: '/auth/register',
        icon: '#custom-password-check',
        target: true,
        breadcrumbs: false
      }
    ]
  },
];
