import { routes } from './app.routes';

describe('App Routes', () => {
  it('should have a default redirect to /home', () => {
    const defaultRoute = routes.find(route => route.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute?.redirectTo).toBe('home');
  });

  it('should lazy load HomeComponent on /home', async () => {
    const homeRoute = routes.find(route => route.path === 'home');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.loadComponent).toBeDefined();

    const homeComponent = await homeRoute!.loadComponent!();
    expect(homeComponent).toBeDefined();
  });

  it('should lazy load ServicesDetailComponent on /services-detail', async () => {
    const servicesDetailRoute = routes.find(route => route.path == 'services-detail');
    expect(servicesDetailRoute).toBeDefined();
    expect(servicesDetailRoute?.loadComponent).toBeDefined();

    const servicesDetailComponent = await servicesDetailRoute!.loadComponent!();
    expect (servicesDetailComponent).toBeDefined();
  });
});
