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

  it('should lazy load TherapiesDetailComponent on /terapias/:therapyType', async () => {
    const therapiesDetailRoute = routes.find(route => route.path == 'terapias/:therapyType');
    expect(therapiesDetailRoute).toBeDefined();
    expect(therapiesDetailRoute?.loadComponent).toBeDefined();

    const therapiesDetailComponent = await therapiesDetailRoute!.loadComponent!();
    expect (therapiesDetailComponent).toBeDefined();
  });

  it('should lazy load AdvicesDetailComponent on /consejos', async () => {
    const advicesRoute = routes.find(route => route.path === 'consejos');
    expect(advicesRoute).toBeDefined();
    expect(advicesRoute?.loadComponent).toBeDefined();

    const advicesComponent = await advicesRoute!.loadComponent!();
    expect(advicesComponent).toBeDefined();
  })
});
