import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { getLineItemList, getLineItemRecords } from "@/actions/lineItems";
import { DOMAIN } from "@/constants";
import { generateSlug } from "@/lib/utils";
import { LineItemsObject } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const dealId = req.nextUrl.searchParams.get("associatedObjectId");
    const portalId = req.nextUrl.searchParams.get("portalId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!dealId || !portalId || !userId) {
      return Response.json({
        message: "Fields are required",
      });
    }

    const accessToken = await getAccessTokenWithPortalId(Number(portalId));


    if (!accessToken) {
      return NextResponse.json({
        message: "Access Token Not Generated",
      });
    }

    const list: string[] | undefined = await getLineItemList(
      accessToken,
      Number(dealId)
    );

    if (!list) {
      return NextResponse.json({
        message: "No Line Item Found",
      });
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

    console.log(record);

    const data = record.map((item, index) => {
      return {
        objectId: Number(item.id),
        title: item.properties.name,
        link: null,
        unitPrice: Number(item.properties.price),
        quantity: Number(item.properties.quantity),
        discount: `${item.properties.hs_discount_percentage || 0}%`,
        amount: Number(item.properties.amount),
        actions: [
          {
            type: "IFRAME",
            width: 890,
            height: 748,
            uri: `${DOMAIN}/dashboard/edit?lineItemId=${item.id}&hsProductId=${
              item.properties.hs_product_id
            }&portalId=${portalId}&dealId=${dealId}&collection=${generateSlug(
              item.properties.name
            )}_${item.properties.hs_product_id}&userId=${userId}`,
            label: "Edit",
          },
          {
            type: "CONFIRMATION_ACTION_HOOK",
            confirmationMessage: "Are you sure you want to delete this ticket?",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            httpMethod: "DELETE",
            associatedObjectProperties: ["protected_account"],
            uri: `${DOMAIN}/api/crm-card/delete?lineItemId=${item.id}&portalId=${portalId}`,
            label: "Delete",
          },
        ],
      };
    });

    return Response.json({
      results: data,
      secondaryActions: [
        {
          type: "IFRAME",
          width: 890,
          height: 748,
          uri: `${DOMAIN}/dashboard?portalId=${portalId}&dealId=${dealId}&userId=${userId}`,
          label: "View Dashboard",
        },
      ],
    });
  } catch (error: any) {
    return Response.json({
      message: error.message,
    });
  }
};

export const dynamic = "force-dynamic";

// export const updateRecords = async (dealId, accessToken) => {
//   const getLineItems = `https://api.hubapi.com/crm/v3/objects/line_items?associations.deals=${dealId}`;
//   try {
//     const response = await axios.post(getLineItems, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return Response.json
//   } catch (error) {
//     console.error(error.message);
//   }
// };
