"use client";
import { insertCollectionData } from "@/actions/collections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillingFrequency } from "@/constants";
import { cn, validateTerm } from "@/lib/utils";
import { CollectionDataType } from "@/types";
import { Delete, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DataTableProps {
  portalId: string;
  collection: string;
  data: CollectionDataType[];
  userId: string;
}

const DataTable = ({ data, collection, portalId, userId }: DataTableProps) => {
  const [collectionsData, setCollectionsData] =
    useState<CollectionDataType[]>(data);

  const [isValid, setIsValid] = useState<boolean[]>(
    collectionsData.map((item) => {
      return validateTerm(item.billing_frequency, parseInt(item.term));
    })
  );

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const addNewRow = () => {
    const newRow = {
      hs_recurring_billing_start_date: "",
      term: "",
      billing_frequency: "",
      quantity: "",
      discount: "",
    };

    setCollectionsData([...collectionsData, newRow]);
  };

  const handleDeleteRow = (targetIndex: number) => {
    if (collectionsData.length === 1) {
      toast.error("At lease one row is required");
      return;
    }
    setCollectionsData(collectionsData.filter((_, idx) => idx !== targetIndex));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: keyof CollectionDataType
  ) => {
    const newCollectionsData = [...collectionsData];
    if (field === "term") {
      const newTerm = parseInt(event.target.value); // Convert input value to number
      const result = validateTerm(
        newCollectionsData[index].billing_frequency,
        newTerm
      );

      const isNewValid = [...isValid];
      isNewValid[index] = result;
      setIsValid(isNewValid);
      newCollectionsData[index].term = event.target.value;
    } else {
      newCollectionsData[index][field] = event.target.value.toString();
    }

    setCollectionsData(newCollectionsData);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isEmpty = collectionsData.some((item) => {
        return (
          item.hs_recurring_billing_start_date === "" ||
          item.billing_frequency === "" ||
          item.discount === "" ||
          item.quantity === "" ||
          item.term === ""
        );
      });

      if (isEmpty) {
        toast.error("All fields are required");
        return;
      }

      const response = await insertCollectionData(
        `Account_${portalId}`,
        collection,
        collectionsData
      );

      if (!response) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Data submitted successfully");
      router.push(`/dashboard?portalId=${portalId}&userId=${userId}`);
      setLoading(false);
    } catch (error: any) {
      console.error({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionsData.length === 0) {
      addNewRow();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full  grid place-content-center gap-5">
      <Button variant={"default"} className="w-fit " onClick={addNewRow}>
        Add New Row
      </Button>
      <Table className="w-fit m-auto ">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Billing Start Date</TableHead>
            <TableHead className="font-semibold">Term(Months)</TableHead>
            <TableHead className="font-semibold">Billing Frequency</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Discount</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectionsData?.map((collection, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="date"
                  value={collection.hs_recurring_billing_start_date}
                  onChange={(e) =>
                    handleChange(e, index, "hs_recurring_billing_start_date")
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={collection.term}
                  onChange={(e) => handleChange(e, index, "term")}
                  className={cn(
                    isValid[index] ? "border-input" : "border-red-500"
                  )}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={collection.billing_frequency}
                  onValueChange={(e) => {
                    const newCollectionsData = [...collectionsData];
                    const result = validateTerm(
                      e,
                      parseInt(newCollectionsData[index].term)
                    );
                    const isNewValid = [...isValid];
                    isNewValid[index] = result;
                    setIsValid(isNewValid);
                    newCollectionsData[index].billing_frequency = e;

                    setCollectionsData(newCollectionsData);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Biling Frequency" />
                  </SelectTrigger>
                  <SelectContent className="h-44">
                    {BillingFrequency.map((frequency) => (
                      <SelectItem value={frequency.value} key={frequency.value}>
                        {frequency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={collection.quantity}
                  onChange={(e) => handleChange(e, index, "quantity")}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={collection.discount}
                  onChange={(e) => handleChange(e, index, "discount")}
                />
              </TableCell>
              <TableCell className="flex gap-4">
                <Button
                  variant={"default"}
                  onClick={() => handleDeleteRow(index)}
                >
                  <Delete className="w-4 h-4 text-primary-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button className="w-fit ml-4" onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
};

export default DataTable;
