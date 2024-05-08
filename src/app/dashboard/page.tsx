"use client";

import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getCollectionList } from "@/actions/collections";
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
import { useState } from "react";

import { CollectionList, UserData } from "@/types";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getUser } from "@/actions/user";
import { Input } from "@/components/ui/input";

interface DashboardPageProps {
  searchParams: {
    dealId: string;
    portalId: string;
    userId: string;
  };
}

const DashboardPage = ({
  searchParams: { dealId, portalId, userId },
}: DashboardPageProps) => {
  const [userData, setUserData] = useState<UserData>();
  const [collectionList, setCollectionList] = useState<CollectionList[]>([]);
  const [search, setSearch] = useState("");
  if (!portalId || !userId) {
    throw new Error("Portal Id, User Id and Deal Id are required");
  }

  const getCollections = async () => {
    const response = await getCollectionList(`Account_${portalId}`);
    if (!response) {
      toast.error("Collection Not Found");
      return;
    }
    setCollectionList(response);
  };

  // Fetching Collections and Access Token

  const getUserData = async () => {
    const response = await getUser(portalId, userId);
    if (!response) {
      toast.error("User Not Found");
      return;
    }
    setUserData(response);
  };

  useEffect(() => {
    getCollections();
    getUserData();
  }, []);

  if (collectionList.length === 0 || !userData) {
    return (
      <div className="w-full min-h-screen grid place-content-center">
        Loading...
      </div>
    );
  }

  // Fetching User Data

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

export default DashboardPage;
