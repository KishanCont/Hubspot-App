import { AxiosResponse } from "axios";
import { Document, WithId } from "mongodb";

export interface CollectionTypeResponse {
  name: string;
  info: {
    uuid: string;
  };
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleIds: [];
  superAdmin: boolean;
}
export interface CollectionType {
  name: string;
  uuid: string;
}

export interface CollectionDataResponse extends WithId<Document> {
  hs_recurring_billing_start_date: string;
  term: string;
  billing_frequency: string;
  quantity: string;
  discount: string;
}

export interface CollectionDataType {
  hs_recurring_billing_start_date: string;
  term: string;
  billing_frequency: string;
  quantity: string;
  discount: string;
}

export interface LineItemsProperties extends WithId<Document> {
  name: string;
  quantity: string;
  hs_product_id: string;
  hs_object_id: string;
  recurringbillingfrequency: string;
  hs_recurring_billing_period: string;
  hs_discount_percentage: string;
  hs_recurring_billing_start_date: string;
  hs_billing_start_delay_days: string;
  hs_billing_start_delay_months: string;
  hs_billing_start_delay_type: string;
}

export interface LineItemsObject {
  id: string;
  properties: LineItemsProperties;
}

export interface LineItemsPropertiesResponse extends AxiosResponse {
  data: LineItemsProperties[];
}

export interface CollectionList {
  name: string;
  uuid: string;
}

export interface LineItemsResponse extends AxiosResponse {
  data: {
    results: {
      id: string;
    }[];
  };
}
