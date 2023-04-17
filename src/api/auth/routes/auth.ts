export default {
  routes: [
    {
     method: 'GET',
     path: '/auth',
     handler: 'auth.redirectWithIdToken',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
