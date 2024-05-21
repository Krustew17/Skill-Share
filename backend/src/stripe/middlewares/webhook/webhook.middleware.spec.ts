import { WebhookMiddleware } from './webhook.middleware';

describe('WebhookMiddleware', () => {
  it('should be defined', () => {
    expect(new WebhookMiddleware()).toBeDefined();
  });
});
