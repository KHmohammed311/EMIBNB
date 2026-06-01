import { HttpInterceptorFn } from '@angular/common/http';

// Bypass l'interstitiel ngrok pour toutes les requêtes API
export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  const modified = req.clone({
    setHeaders: { 'ngrok-skip-browser-warning': 'true' }
  });
  return next(modified);
};
