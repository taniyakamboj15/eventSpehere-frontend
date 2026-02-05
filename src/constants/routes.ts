export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  CREATE_EVENT: '/events/create',
  VERIFY_EMAIL: '/verify-email',
  EVENT_DETAILS: (id: string = ':id') => `/events/${id}`,
  CHECK_IN: (id: string = ':id') => `/events/${id}/checkin`,
};
