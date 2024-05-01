"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Benefits, TechnicalConsiderations } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [truncate, setTruncate] = useState<boolean[]>([false, false, false]);
  return (
    <div className="px-40 py-20">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      <div className="flex justify-center flex-col items-center mt-32 mb-12 z-2 space-y-4">
        <h1 className="text-7xl text-primary  font-semibold">Business Rules</h1>
        <p className="text-base w-1/2 text-center text-muted-foreground">
          The app establishes a centralized table where authorized personnel can
          set consistent discount rates for various products or categories
        </p>
        <Button asChild>
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_AUTHORIZATION_URL!}
          >
            Install Now
          </Link>
        </Button>
      </div>

      <div>
        <h3 className="text-4xl underline  text-gray-800 font-[merriweather]">
          Benefits
        </h3>
        <div className="grid grid-cols-3 gap-10 mt-8">
          {Benefits.map((item, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-none transition-all ease-in-out duration-300"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-4xl underline  text-gray-800 font-[merriweather] mt-20">
          Technical Considerations
        </h3>
        <div className="grid grid-cols-3 gap-10 mt-8">
          {TechnicalConsiderations.map((item, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-none transition-all ease-in-out duration-300"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn(truncate[index] ? "" : "truncate")}>
                  {item.description}{" "}
                </p>
                <span
                  onClick={() => {
                    const isTruncate = [...truncate];
                    isTruncate[index] = !isTruncate[index];
                    setTruncate(isTruncate);
                  }}
                  className="text-primary underline cursor-pointer"
                >
                  {truncate[index] ? "Show Less" : "Show More"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
