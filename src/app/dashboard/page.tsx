import { getCollectionList } from "@/actions/collections";

import { getUser } from "@/actions/user";

import DashboardTable from "@/components/DashboardTable";
import { CollectionList, UserData } from "@/types";

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
  if (!portalId || !userId) {
    throw new Error("Portal Id & User Id are required");
  }

  const collections: CollectionList[] = (await getCollectionList(
    `Account_${portalId}`
  )) as CollectionList[];

  // Fetching Collections and Access Token
  const userData: UserData = await getUser(portalId, userId);

  if (collections.length === 0 || !userData) {
    return (
      <div className="w-full min-h-screen grid place-content-center">
        Loading...
      </div>
    );
  }

  return (
    <DashboardTable
      collectionList={collections}
      userData={userData}
      portalId={portalId}
      userId={userId}
      dealId={dealId}
    />
  );
};

export default DashboardPage;
