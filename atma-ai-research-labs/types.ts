export enum RoutePath {
  HOME = '/',
  TECHNOLOGY = '/technology',
  USE_CASES = '/use-cases',
  TEAM = '/team',
  ROADMAP = '/roadmap',
  CONTACT = '/contact',
  SEARCH = '/search'
}

export interface NavItem {
  label: string;
  path: RoutePath;
}