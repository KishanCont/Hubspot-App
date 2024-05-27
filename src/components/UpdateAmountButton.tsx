"use client";

import React from "react";
import { Button } from "./ui/button";
import { updateDeal } from "@/actions/user";
import { useRouter } from "next/navigation";

const UpdateAmountButton = ({
  portalId,
  dealId,
  amount,
  userId,
}: {
  portalId: string;
  dealId: string;
  amount: number;
  userId: string;
}) => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await updateDeal(portalId, amount, dealId);
        router.push(
          `/dashboard?portalId=${portalId}&userId=${userId}&dealId=${dealId}`
        );
      }}
    >
      Yes
    </Button>
  );
};

export default UpdateAmountButton;
