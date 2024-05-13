import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { associateLineToDeal, createLineItem } from "@/actions/lineItems";

import { createLineItemSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const dealId = req.nextUrl.searchParams.get("dealId");
    const portalId = req.nextUrl.searchParams.get("portalId");
    const validatedSchema = createLineItemSchema.safeParse(body);

    if (!validatedSchema.success) {
      return Response.json({ message: "All Fields are required" });
    }

    const newBody = {
      properties: validatedSchema.data,
    };

    const accessToken = await getAccessTokenWithPortalId(Number(portalId));

    if (!accessToken) {
      return Response.json({ message: "Access Token Not Generated" });
    }

    const lineItemId = await createLineItem(accessToken, newBody);
    if (!lineItemId) {
      return Response.json({ message: "error" });
    }

    const response = await associateLineToDeal(
      accessToken,
      dealId!,
      lineItemId
    );

    if (!response) {
      return Response.json({ message: "error" });
    }

    return Response.json({ message: "success" });
  } catch (error: any) {
    console.log(error);
    return Response.json({ message: error.message });
  }
};
