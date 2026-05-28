export default {
  routes: [
    {
      method: 'POST',
      path: '/likes/toggle',
      handler: 'like.toggle',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/likes/status/:documentId',
      handler: 'like.status',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
