import {
  IPaymentService,
  ISubscriptionService,
  SubscriptionNotActiveError,
  NotFoundError,
  IMailingService,
} from '@package/domain';

export class SuspendSubscription {
  readonly subscriptionService: ISubscriptionService;
  readonly paymentService: IPaymentService;
  readonly mailingService: IMailingService;

  constructor(
    subscriptionService: ISubscriptionService,
    paymentService: IPaymentService,
    mailingService: IMailingService,
  ) {
    this.subscriptionService = subscriptionService;
    this.paymentService = paymentService;
    this.mailingService = mailingService;

    this.do = this.do.bind(this);
  }

  async do(userId: string) {
    const user_subscription = await this.subscriptionService.getSubscription(userId);

    if (!user_subscription) {
      throw new NotFoundError();
    }

    const stripe_subscription = await this.paymentService.getSubscription(user_subscription.subscription_id);

    const subscription_status = await this.paymentService.getSubscriptionStatus(user_subscription.subscription_id);

    if (subscription_status !== 'active' || stripe_subscription.cancel_at_period_end) {
      throw new SubscriptionNotActiveError();
    }

    await this.paymentService.suspendSubscription(stripe_subscription.id);

    await this.mailingService.sendSuspendingSubscriptionEmail('adlpromail@gmail.com');
  }
}
