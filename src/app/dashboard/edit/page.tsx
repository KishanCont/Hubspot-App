"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getCollectionData } from "@/actions/collections";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import ReadOnlyTable from "@/components/ReadOnlyTable";
import LineItemForm from "@/components/form/LineItemForm";
import { Button } from "@/components/ui/button";
import { removeFirstAndLastLetter } from "@/lib/utils";
import { LineItem } from "@/lib/validation";
import { CollectionDataType } from "@/types";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
    collection: string;
    userId: string;
  };
}) => {
  const { lineItemId, hsProductId, portalId, collection, dealId, userId } =
    searchParams;
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
  const [productDataTable, setProductDataTable] = useState<
    CollectionDataType[]
  >([]);
  const router = useRouter();
  const [discount, setDiscount] = useState<string>("");
  const [filteredData, setFilteredData] = useState<CollectionDataType[]>([]);

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
          response.hs_recurring_billing_start_date
            ? response.hs_recurring_billing_start_date
            : "",
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
    getProductDataTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductDataTable = async () => {
    const response: CollectionDataType[] | undefined = await getCollectionData(
      `Account_${portalId}`,
      collection
    );
    if (!response) {
      throw new Error("Product Collection Not Found");
    }
    setProductDataTable(response);
  };

  useEffect(() => {
    if (productDataTable.length > 0) {
      const newData = productDataTable.filter(
        (item) =>
          item.quantity == inputData.quantity &&
          item.term == inputData.hs_recurring_billing_period &&
          item.billing_frequency == inputData.recurringbillingfrequency
      );
      setFilteredData(newData);
      if (newData.length === 1) {
        setDiscount(newData[0].discount);
      } else {
        setDiscount("");
      }
    }
  }, [inputData, setInputData]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (discount) {
        inputData.hs_discount_percentage = discount;
      }
      const response = await axios.patch(
        `/api/crm-card/edit?portalId=${portalId}&lineItemId=${lineItemId}`,
        {
          ...inputData,
          hs_recurring_billing_period:
            inputData.recurringbillingfrequency === "one-time"
              ? ""
              : `P${inputData.hs_recurring_billing_period}M`,
          hs_recurring_billing_start_date:
            inputData.hs_recurring_billing_start_date === "" &&
            inputData.hs_billing_start_delay_days === "" &&
            inputData.hs_billing_start_delay_months === "" &&
            inputData.hs_billing_start_delay_type === ""
              ? ""
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
      // console.log(inputData);
      toast.success("Line Item updated successfully");
      router.push(
        `/dashboard/updateAmount?portalId=${portalId}&dealId=${dealId}&userId=${userId}`
      );
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
        discount={discount}
      />
      <Button
        onClick={onSubmit}
        disabled={loading || filteredData.length === 0}
      >
        Submit
      </Button>
      {filteredData.length === 0 &&
      inputData.quantity &&
      inputData.recurringbillingfrequency &&
      inputData.hs_recurring_billing_period ? (
        <p>Kindly Contact to Your administrator for discount.</p>
      ) : (
        <ReadOnlyTable data={filteredData} />
      )}
    </div>
  );
};

export default EditPage;
