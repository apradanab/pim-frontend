import { routes } from './app.routes';
import { authGuard } from './core/guards/auth.guard';

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
  });

  it('should lazy load AdvicesViewComponent on /consejos/:adviceId', async () => {
    const adviceDetailRoute = routes.find(route => route.path === 'consejos/:adviceId');
    expect(adviceDetailRoute).toBeDefined();
    expect(adviceDetailRoute?.loadComponent).toBeDefined();

    const adviceDetailComponent = await adviceDetailRoute!.loadComponent!();
    expect(adviceDetailComponent).toBeDefined();
  });

  it('should lazy load ScheduleViewComponent on /horarios', async () => {
    const scheduleRoute = routes.find(route => route.path === 'horarios');
    expect(scheduleRoute).toBeDefined();
    expect(scheduleRoute?.loadComponent).toBeDefined();

    const scheduleComponent = await scheduleRoute!.loadComponent!();
    expect(scheduleComponent).toBeDefined();
  });

  it('should lazy load UserProfileViewComponent on /perfil with authGuard', async () => {
    const route = routes.find(route => route.path === 'perfil');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
    expect(route?.canActivate).toContain(authGuard);

    const component = await route!.loadComponent!();
    expect(component).toBeDefined();
  });

  it('should lazy load AdminPanelViewComponent on /admin', async () => {
    const route = routes.find(route => route.path === 'admin');
    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();

    const component = await route!.loadComponent!();
    expect(component).toBeDefined();
  });
});
