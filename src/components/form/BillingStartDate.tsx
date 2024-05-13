import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineItem } from "@/lib/validation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BillingStartDateSelect, SelectTypes } from "@/constants";

interface Props {
  inputData: LineItem;
  setInputData: Dispatch<SetStateAction<LineItem>>;
}

const BillingStartDate = ({ inputData, setInputData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState({
    hs_recurring_billing_start_date: false,
    hs_billing_start_delay_days: false,
    hs_billing_start_delay_months: false,
  });
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [startBillingTerm, setStartBillingTerm] = useState<string>("");
  const selectChange = (e: string) => {
    if (e === "at_payment") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: "",
        hs_billing_start_delay_type: "",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
      });
    } else {
      setIsModalOpen({ ...isModalOpen, [e]: true });
    }
    setStartBillingTerm(e);
  };

  const onOpenChange = (e: boolean) => {
    setIsModalOpen({ ...isModalOpen, [startBillingTerm]: e });
  };

  const onSubmit = (e: keyof SelectTypes) => {
    setIsModalOpen({ ...isModalOpen, [e]: false });
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof SelectTypes
  ) => {
    if (field === "hs_recurring_billing_start_date") {
      setInputData({
        ...inputData,
        hs_recurring_billing_start_date: e.target.value,
        hs_billing_start_delay_type: "",
        hs_billing_start_delay_months: "",
        hs_billing_start_delay_days: "",
      });
    } else if (field === "hs_billing_start_delay_days") {
      setInputData({
        ...inputData,
        hs_billing_start_delay_days: e.target.value,
        hs_billing_start_delay_type: field,
        hs_billing_start_delay_months: "",
        hs_recurring_billing_start_date: "",
      });
    } else if (field === "hs_billing_start_delay_months") {
      setInputData({
        ...inputData,
        hs_billing_start_delay_months: e.target.value,
        hs_billing_start_delay_type: field,
        hs_billing_start_delay_days: "",
        hs_recurring_billing_start_date: "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="startBillingDate">Billing Start Date</Label>
      <div className="relative">
        <Button
          className="relative w-full justify-start z-10 py-0 px-3 font-normal "
          onClick={() => {
            setIsSelectOpen(true);
          }}
          variant={"outline"}
          id="startBillingDate"
        >
          {inputData.hs_billing_start_delay_days ? (
            <p>{`${inputData.hs_billing_start_delay_days} days after payment`}</p>
          ) : inputData.hs_billing_start_delay_months ? (
            <p>{`${inputData.hs_billing_start_delay_months} months after payment`}</p>
          ) : (
            <p>
              {inputData.hs_recurring_billing_start_date === ""
                ? "At Payment"
                : inputData.hs_recurring_billing_start_date}
            </p>
          )}
        </Button>
        <Select
          value={startBillingTerm}
          onValueChange={selectChange}
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger className="absolute top-0 left-0 -z-2 w-full">
            <SelectValue placeholder="Billing Start Date" />
          </SelectTrigger>
          <SelectContent>
            {BillingStartDateSelect.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                <Dialog
                  open={isModalOpen[item.value]}
                  onOpenChange={onOpenChange}
                >
                  <DialogTrigger>{item.label}</DialogTrigger>
                  <DialogContent>
                    <Input
                      type={item.type}
                      value={inputData[item.value]!}
                      onChange={(e) => onChange(e, item.value)}
                    />
                    <Button
                      onClick={() => onSubmit(item.value)}
                      disabled={!inputData[item.value]}
                    >
                      Submit
                    </Button>
                  </DialogContent>
                </Dialog>
              </SelectItem>
            ))}
            <SelectItem value={"at_payment"}>At Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BillingStartDate;
