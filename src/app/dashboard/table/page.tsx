import { getCollectionData } from "@/actions/collections";
import DataTable from "@/components/DataTable";
import { decodeSlug, removeId } from "@/lib/utils";
import { CollectionDataType } from "@/types";
import React from "react";

interface SearchParamsProps {
  searchParams: {
    collection: string;
    portalId: string;
    userId: string;
  };
}

const TablePage = async ({
  searchParams: { collection, portalId, userId },
}: SearchParamsProps) => {
  const collectionData: CollectionDataType[] = (await getCollectionData(
    `Account_${portalId}`,
    collection
  )) as CollectionDataType[];

  if (!collectionData) {
    throw new Error("Collection Data Not Found");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 ">
      {collectionData && (
        <DataTable
          data={collectionData}
          portalId={portalId}
          collection={collection}
          userId={userId}
        />
      )}
    </div>
  );
};

export default TablePage;
