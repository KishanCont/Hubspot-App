"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import LineItemForm from "@/components/form/LineItemForm";
import { Button } from "@/components/ui/button";
import { removeFirstAndLastLetter } from "@/lib/utils";
import { LineItem } from "@/lib/validation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditPage = ({
  searchParams,
}: {
  searchParams: {
    lineItemId: string;
    hsProductId: string;
    portalId: string;
    name: string;
    dealId: string;
  };
}) => {
  const { lineItemId, hsProductId, portalId, name, dealId } = searchParams;
  const [inputData, setInputData] = useState<LineItem>({
    name: "",
    quantity: "",
    hs_product_id: hsProductId,
    recurringbillingfrequency: "",
    hs_recurring_billing_period: "",
    hs_discount_percentage: "",
    hs_recurring_billing_start_date: "",
    hs_billing_start_delay_days: "",
    hs_billing_start_delay_months: "",
    hs_billing_start_delay_type: "",
  });
  const [dataFetching, setDataFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const getListItems = async () => {
    try {
      setDataFetching(true);
      const accessToken = await getAccessTokenWithPortalId(Number(portalId));
      const list = await getLineItemList(accessToken!, Number(dealId));
      const data = await getLineItemRecords(list!, accessToken!);

      const response = data!.filter((item) => item.id == lineItemId)[0]
        .properties;

      if (!response) {
        throw new Error("List Item not found");
      }
      console.log(response);

      setInputData({
        ...inputData,
        name: response.name,
        quantity: response.quantity,
        hs_recurring_billing_period: response.hs_recurring_billing_period
          ? removeFirstAndLastLetter(response.hs_recurring_billing_period)
          : "0",
        hs_discount_percentage: response.hs_discount_percentage
          ? response.hs_discount_percentage
          : "0",
        hs_recurring_billing_start_date:
          response.hs_recurring_billing_start_date,
        recurringbillingfrequency:
          response.recurringbillingfrequency || "one-time",
        hs_billing_start_delay_days: response.hs_billing_start_delay_days,
        hs_billing_start_delay_months: response.hs_billing_start_delay_months,
        hs_billing_start_delay_type: response.hs_billing_start_delay_type,
      });

      setDataFetching(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDataFetching(false);
    }
  };

  useEffect(() => {
    getListItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/crm-card/edit?portalId=${portalId}&lineItemId=${lineItemId}`,
        {
          ...inputData,
          hs_recurring_billing_period:
            inputData.recurringbillingfrequency === "one-time"
              ? ""
              : `P${inputData.hs_recurring_billing_period}M`,
          hs_recurring_billing_start_date:
            inputData.hs_billing_start_delay_days === "At Payment"
              ? null
              : inputData.hs_recurring_billing_start_date,
          recurringbillingfrequency:
            inputData.recurringbillingfrequency === "one-time"
              ? ""
              : inputData.recurringbillingfrequency,
        }
      );
      if (!response.data) {
        throw new Error("Something went wrong");
      }
      console.log(inputData);
      toast.success("Line Item updated successfully");
      window.location.reload();
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return dataFetching ? (
    <div className="flex justify-center items-center h-screen">
      <div className="loader" />
    </div>
  ) : (
    <div className="max-w-7xl mx-auto space-y-5 p-10">
      <LineItemForm
        // action="Edit"
        inputData={inputData}
        setInputData={setInputData}
      />
      <Button onClick={onSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
};

export default EditPage;
