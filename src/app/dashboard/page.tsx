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
import { UserData } from "@/types";
import axios from "axios";
import Link from "next/link";

interface DashboardPageProps {
  searchParams: {
    dealId: string;
    portalId: string;
    userId: string;
  };
}

const DashboardPage = async ({
  searchParams: { dealId, portalId, userId },
}: DashboardPageProps) => {
  if (!dealId || !portalId || !userId) {
    throw new Error("Portal Id, User Id and Deal Id are required");
  }

  // Fetching Collections and Access Token
  const getCollections = await getCollectionList(`Account_${portalId}`);
  const accessToken = await getAccessTokenWithPortalId(Number(portalId));

  if (!accessToken) {
    throw new Error("Access Token Not Generated");
  }

  if (!getCollections) {
    throw new Error("Collection List Not Found");
  }

  // Fetching User Data
  const getUserData: {
    data: UserData;
  } = await axios.get(`https://api.hubapi.com/settings/v3/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return (
    <div className="w-full min-h-screen grid place-content-center">
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
          {getCollections.map((collection) => (
            <TableRow key={collection.uuid}>
              <TableCell>{removeId(decodeSlug(collection.name))}</TableCell>
              <TableCell className="flex gap-2">
                {getUserData.data.superAdmin && (
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
