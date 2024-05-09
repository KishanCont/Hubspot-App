"use client";

import { getCollectionData } from "@/actions/collections";
import LineItemForm from "@/components/form/LineItemForm";
import ReadOnlyTable from "@/components/ReadOnlyTable";
import { Button } from "@/components/ui/button";
import { decodeSlug, getId, removeId } from "@/lib/utils";
import { LineItem } from "@/lib/validation";
import { CollectionDataType } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CreateLineItem = ({
  searchParams: { collection, portalId, dealId, userId },
}: {
  searchParams: {
    portalId: string;
    dealId: string;
    collection: string;
    userId: string;
  };
}) => {
  const [productDataTable, setProductDataTable] = useState<
    CollectionDataType[]
  >([]);
  const router = useRouter();

  const [inputData, setInputData] = useState<LineItem>({
    quantity: "",
    hs_product_id: getId(decodeSlug(collection)),
    name: "",
    recurringbillingfrequency: "",
    hs_recurring_billing_period: "",
    hs_recurring_billing_start_date: "At Payment",
    hs_discount_percentage: "",
    hs_billing_start_delay_days: "",
    hs_billing_start_delay_months: "",
    hs_billing_start_delay_type: "",
  });
  const [discount, setDiscount] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<CollectionDataType[]>([]);

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
    getProductDataTable();
  }, []);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (discount) {
        inputData.hs_discount_percentage = discount;
      }
      // console.log(inputData);
      const response = await axios.post(
        `/api/crm-card/createLineItem?portalId=${portalId}&dealId=${dealId}`,
        {
          ...inputData,
          hs_recurring_billing_period:
            inputData.recurringbillingfrequency === "one-time"
              ? ""
              : `P${inputData.hs_recurring_billing_period}M`,
          hs_recurring_billing_start_date:
            inputData.hs_billing_start_delay_days === ""
              ? ""
              : inputData.hs_recurring_billing_start_date,
          recurringbillingfrequency:
            inputData.recurringbillingfrequency === "one-time"
              ? ""
              : inputData.recurringbillingfrequency,
        }
      );

      if (!response.data) {
        throw new Error("Line Item not Created");
      }
      toast.success("Line Item created successfully");
      setLoading(false);
      router.push(
        `/dashboard?portalId=${portalId}&userId=${userId}&dealId=${dealId}`
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-7xl m-auto space-y-4">
      <div>
        <h1 className="text-3xl mt-6 font-bold text-primary underline ">
          {removeId(decodeSlug(collection))}
        </h1>
      </div>
      <div className="space-y-5">
        <LineItemForm
          inputData={inputData}
          setInputData={setInputData}
          discount={discount}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
        <ReadOnlyTable data={filteredData} />
      </div>
    </div>
  );
};

export default CreateLineItem;
