import { LineItem } from "@/lib/validation";

export const CLIENT_ID = process.env.CLIENT_ID!;
export const CLIENT_SECRET = process.env.CLIENT_SECRET!;
export const AUTHORIZATION_URL = process.env.NEXT_PUBLIC_AUTHORIZATION_URL!;
export const REDIRECT_URI = process.env.REDIRECT_URI!;
export const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI!;
export const DOMAIN = process.env.DOMAIN;

export const PORT = process.env.PORT || 5000;
export const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY!;
export const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID!;
export const MONGO_DB_NAME = process.env.NEXT_PUBLIC_DB_NAME!;

export const BillingFrequency: {
  value: string;
  label: string;
}[] = [
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "annually",
    label: "Annually",
  },
  {
    value: "per_six_months",
    label: "Bi-Annually",
  },
  {
    value: "per_two_years",
    label: "Every 2 Years",
  },
  {
    value: "quarterly",
    label: "Quarterly",
  },
  {
    value: "one-time",
    label: "One Time",
  },
  {
    value: "per_three_years",
    label: "Every 3 Years",
  },
  {
    value: "every four years",
    label: "Every 4 Years",
  },
  {
    value: "every five years",
    label: "Every 5 Years",
  },
];

export interface SelectTypes {
  hs_recurring_billing_start_date: string;
  hs_billing_start_delay_months: string;
  hs_billing_start_delay_days: string;
}

export const BillingStartDateSelect: {
  value: keyof SelectTypes;
  type: string;
  label: string;
}[] = [
  {
    value: "hs_recurring_billing_start_date",
    type: "date",
    label: "Custom Date",
  },
  {
    value: "hs_billing_start_delay_months",
    type: "text",
    label: "Delayed Start (months)",
  },
  {
    value: "hs_billing_start_delay_days",
    type: "text",
    label: "Delayed Start (days)",
  },
];

export const Benefits: { title: string; description: string }[] = [
  {
    title: "Ensures Consistency",
    description:
      "Standardizes discount rates across the sales team, eliminating errors and inconsistencies.",
  },
  {
    title: "Improved Efficiency",
    description:
      "Automates discount application, saving sales reps time and minimizing manual calculations.",
  },
  {
    title: "Centralized Management",
    description:
      "Provides a central location to manage and update discount rates for easy access and control by authorized personnel.",
  },
];

export const TechnicalConsiderations: { title: string; description: string }[] =
  [
    {
      title: "CRM Card",
      description:
        "The app should leverage the HubSpot CRM Card to create the discount rate table. A CRM Card is also used to show the line items which are created by the authorized personnel.  With the Help of a CRM Card you can also delete and edit ine items.",
    },
    {
      title: "Webhooks",
      description:
        "Webhooks in HubSpot called when user create and delete the products and this webhook also connect with our database which help to create collection of product with notation {product name}_{product id}",
    },
    {
      title: "UI According to Role (Admin or Normal User)",
      description:
        "Consider implementing user interface (UI) elements within the HubSpot CRM deal creation or editing process to reflect the applied discount rate (read-only for most users).",
    },
  ];
