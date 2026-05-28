import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::like.like', ({ strapi }) => ({
  async toggle(ctx) {
    const { articleDocumentId } = ctx.request.body as { articleDocumentId?: string };

    if (!articleDocumentId) {
      return ctx.badRequest('articleDocumentId is required');
    }

    const forwarded = ctx.request.headers['x-forwarded-for'] as string | undefined;
    const ip = forwarded?.split(',')[0]?.trim() ?? ctx.request.ip ?? 'unknown';

    const article = await strapi.db.query('api::article.article').findOne({
      where: { documentId: articleDocumentId },
    });

    if (!article) return ctx.notFound('Article not found');

    const existing = await strapi.db.query('api::like.like').findOne({
      where: { article: article.id, ip },
    });

    if (existing) {
      await strapi.db.query('api::like.like').delete({ where: { id: existing.id } });
    } else {
      await strapi.db.query('api::like.like').create({
        data: { article: article.id, ip },
      });
    }

    const count = await strapi.db.query('api::like.like').count({
      where: { article: article.id },
    });

    ctx.body = { liked: !existing, count };
  },

  async status(ctx) {
    const { documentId } = ctx.params as { documentId: string };

    const forwarded = ctx.request.headers['x-forwarded-for'] as string | undefined;
    const ip = forwarded?.split(',')[0]?.trim() ?? ctx.request.ip ?? 'unknown';

    const article = await strapi.db.query('api::article.article').findOne({
      where: { documentId },
    });

    if (!article) return ctx.notFound('Article not found');

    const [liked, count] = await Promise.all([
      strapi.db.query('api::like.like').findOne({
        where: { article: article.id, ip },
      }),
      strapi.db.query('api::like.like').count({
        where: { article: article.id },
      }),
    ]);

    ctx.body = { liked: !!liked, count };
  },
}));
