import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import UpdateAmountButton from "@/components/UpdateAmountButton";
import { Button } from "@/components/ui/button";
import { LineItemsObject } from "@/types";
import Link from "next/link";

const UpdateAmount = async ({
  searchParams: { dealId, portalId, userId },
}: {
  searchParams: {
    portalId: string;
    dealId: string;
    userId: string;
  };
}) => {
  const accessToken = await getAccessTokenWithPortalId(Number(portalId));

  if (!accessToken) {
    throw new Error("Not get access token");
  }

  const list: string[] | undefined = await getLineItemList(
    accessToken,
    Number(dealId)
  );

  if (!list) {
    throw new Error("No Line Item found");
  }

  const record: LineItemsObject[] | undefined = await getLineItemRecords(
    list,
    accessToken
  );

  if (!record) {
    return Response.json({
      message: "No record found",
    });
  }
  const amount = record.map((item) => {
    return Number(item.properties.amount);
  });

  const updatedAmount = amount.reduce((acc, item) => {
    return acc + item;
  });
  // console.log(updatedAmount);

  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center h-[90vh] items-center">
      <h1>Do you want to update deal amount?</h1>
      <div className="flex gap-4 mt-4">
        <UpdateAmountButton
          amount={updatedAmount}
          portalId={portalId}
          dealId={dealId}
          userId={userId}
        />

        <Button asChild>
          <Link
            href={`/dashboard?portalId=${portalId}&userId=${userId}&dealId=${dealId}`}
          >
            No
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UpdateAmount;
