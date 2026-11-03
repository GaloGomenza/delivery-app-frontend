import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from './service/token-service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
   
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  if(token){
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
  
};
