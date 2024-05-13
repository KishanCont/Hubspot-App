"use server";

import { UserData } from "@/types";
import { getAccessTokenWithPortalId } from "./authToken";
import axios from "axios";

export const getUser = async (portalId: string, userId: string) => {
  const accessToken = await getAccessTokenWithPortalId(Number(portalId));
  const response: {
    data: UserData;
  } = await axios.get(`https://api.hubapi.com/settings/v3/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const createDeal = async (portalId: string) => {
  const accessToken = await getAccessTokenWithPortalId(Number(portalId));

  const body = {
    properties: {
      dealname: "Installation deal",
      pipeline: "default",
      dealstage: "contractsent",
      //   hubspot_owner_id: "64920891",
    },
  };
  const response = await axios.post(
    `https://api.hubapi.com/crm/v3/objects/deals`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(response.data);
};
