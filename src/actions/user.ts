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
