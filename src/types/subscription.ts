export type PlanType = 'FREE' | 'PREMIUM' | 'PRO';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: number;
  planType: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  planType: PlanType;
  createdAt: string;
}

export interface UpgradeRequest {
  planType: PlanType;
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}
