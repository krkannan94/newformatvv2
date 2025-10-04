export const siteOptions = {
  Apple: ['AMK1', 'AMK2 & 3', 'ONE NORTH'],
  Google: ['Singapore Office', 'Marina Bay', 'Changi Business Park', 'Jurong East'],
  Meta: ['Facebook Singapore', 'WhatsApp Office', 'Instagram Hub', 'Reality Labs']
} as const;

export type AccountType = keyof typeof siteOptions;