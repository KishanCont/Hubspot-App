"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollectionDataType } from "@/types";

const ReadOnlyTable = ({ data }: { data: CollectionDataType[] }) => {
  if (data.length === 0) {
    <div>
      <p>Kindly contact to Your admin</p>
    </div>;
  }

  return (
    <div className="min-h-80">
      <Table className="max-w-7xl mx-auto   ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Term(Months)</TableHead>
            <TableHead className="w-[100px]">Billing Frequency</TableHead>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead className="w-[100px]">Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.term}</TableCell>
              <TableCell>{data.billing_frequency}</TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{data.discount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReadOnlyTable;
