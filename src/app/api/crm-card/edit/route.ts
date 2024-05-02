import { getAccessTokenWithPortalId } from "@/actions/authToken";
import { editLineItem } from "@/actions/lineItems";
import { editLineItemSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const portalId = req.nextUrl.searchParams.get("portalId");
    const lineItemId = req.nextUrl.searchParams.get("lineItemId");
    const body = await req.json();
    const validatedBody = editLineItemSchema.safeParse(body);
    if (!validatedBody.success) {
      console.log(validatedBody.error);
      return Response.json({ message: "All fields are required" });
    }
    console.log(validatedBody);

    const accessToken = await getAccessTokenWithPortalId(Number(portalId));

    const response = await editLineItem(
      accessToken!,
      { properties: validatedBody.data },
      Number(lineItemId)!
    );
    return Response.json({ message: response });
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
