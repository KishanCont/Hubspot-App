import z from "zod";

export const createLineItemSchema = z.object({
  quantity: z.string(),
  name: z.string().optional(),
  hs_product_id: z.string(),
  recurringbillingfrequency: z.string(),
  hs_recurring_billing_period: z.string(),
  hs_recurring_billing_start_date: z.string().optional(),
  hs_discount_percentage: z.string(),
  hs_billing_start_delay_days: z.string().optional(),
  hs_billing_start_delay_months: z.string().optional(),
  hs_billing_start_delay_type: z.string().optional(),
});

export const lineItemSchema = z.object({
  quantity: z.string(),
  hs_product_id: z.string(),
  recurringbillingfrequency: z.string().nullable(),
  hs_recurring_billing_period: z.string().nullable(),
  hs_recurring_billing_start_date: z.string().optional().nullable(),
  hs_discount_percentage: z.string().nullable(),
  hs_billing_start_delay_days: z.string().optional().nullable(),
  hs_billing_start_delay_months: z.string().optional().nullable(),
  hs_billing_start_delay_type: z.string().optional().nullable(),
  name: z.string().optional(),
});

export type LineItem = z.infer<typeof lineItemSchema>;

export const editLineItemSchema = z.object({
  quantity: z.string().optional(),
  hs_product_id: z.string().optional(),
  recurringbillingfrequency: z.string().optional().nullable(),
  hs_recurring_billing_period: z.string().optional().nullable(),
  hs_recurring_billing_start_date: z.string().optional().nullable(),
  name: z.string().optional(),
  hs_discount_percentage: z.string().optional().nullable(),
  hs_billing_start_delay_days: z.string().optional().nullable(),
  hs_billing_start_delay_months: z.string().optional().nullable(),
  hs_billing_start_delay_type: z.string().optional().nullable(),
});
