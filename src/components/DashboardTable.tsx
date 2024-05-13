"use client";

import React, { useState } from "react";
import DeleteCollection from "@/components/DeleteCollection";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decodeSlug, generateSlug, removeId } from "@/lib/utils";
import Link from "next/link";
import { Input } from "./ui/input";
import { CollectionList, UserData } from "@/types";

interface DashboardTableProps {
  collectionList: CollectionList[];
  userData: UserData;
  portalId: string;
  userId: string;
  dealId: string;
}

const DashboardTable = ({
  collectionList,
  userData,
  portalId,
  userId,
  dealId,
}: DashboardTableProps) => {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full min-h-screen grid place-content-center">
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Collection"
        className=" p-2 mb-4 border border-gray-300 rounded"
      />
      <Table className="w-fit m-auto  ">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold w-[300px]">
              Products Name
            </TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectionList
            .filter((collection) =>
              removeId(decodeSlug(collection.name))
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((collection) => (
              <TableRow key={collection.uuid}>
                <TableCell>{removeId(decodeSlug(collection.name))}</TableCell>
                <TableCell className="flex gap-2">
                  {userData.superAdmin && (
                    <>
                      <Button asChild variant={"outline"}>
                        <Link
                          href={`/dashboard/table?collection=${generateSlug(
                            collection.name
                          )}&portalId=${portalId}&userId=${userId}`}
                        >
                          Update Table
                        </Link>
                      </Button>
                      <DeleteCollection
                        collectionName={collection.name}
                        portalId={portalId}
                      />
                    </>
                  )}

                  <Button asChild variant={"outline"}>
                    <Link
                      href={`/dashboard/createLineItem?portalId=${portalId}&dealId=${dealId}&collection=${generateSlug(
                        collection.name
                      )}&userId=${userId}`}
                    >
                      Create Line Item
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTable;
