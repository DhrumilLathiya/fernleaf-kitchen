export interface Company {
  id: string;
  name: string;
  emailDomains: string[];
  deliveryAddresses: string[];
  billingContact: string;
  tierId?: string;
  tier?: {
    id: string;
    name: string;
  };
}
