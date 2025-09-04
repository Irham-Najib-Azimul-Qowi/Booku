import { useState, useCallback } from 'react';

export type Route = 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'dashboard'
  | 'category'
  | 'note-editor'
  | 'tasks'
  | 'profile'
  | 'settings';

export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState<Route>('login');
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});

  const navigate = useCallback((route: Route, params?: Record<string, any>) => {
    setCurrentRoute(prevRoute => {
      if (route !== prevRoute) {
        setRouteParams(params || {});
        return route;
      }
      return prevRoute;
    });
  }, []);

  return { currentRoute, routeParams, navigate };
}