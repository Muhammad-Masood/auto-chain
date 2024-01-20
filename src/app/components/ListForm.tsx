"use client";

import { listFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { TransactionError, useAddress, useContract } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ListVehicle } from "@/lib/types";
import { BigNumber, ethers } from "ethers";

const ListForm = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTill, setDateTill] = useState<Date | undefined>(new Date());
  const address = useAddress();
  const router = useRouter();
  const { contract } = useContract(rentalContractAddress, rentalABI);

  const listForm = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema),
  });

  async function onSubmit(values: z.infer<typeof listFormSchema>) {
    const transLoadToast = toast.loading(
      "Waiting for transaction confirmation..."
    );
    const _price: string = ethers.utils.parseEther(values.price).toString();
    const durationFromTimestamp: number = new Date(
      values.durationFrom
    ).getTime();
    const durationTillTimestamp: number = new Date(
      values.durationTill
    ).getTime();
    const _terms: string = values.terms;
    try {
      const listedVehicle = await contract!.call("addListing", [
        values.tokenId,
        [_price, durationFromTimestamp, durationTillTimestamp, _terms],
      ]);
      console.log(listedVehicle);
      toast.success("Vehicle listed successfully for rent!");
      router.replace(`/rent`);
    } catch (error) {
      const errorReason: string = (error as TransactionError)?.reason;
      toast.error(errorReason);
      console.log(error);
    } finally {
      toast.dismiss(transLoadToast);
    }
  }

  return (
    <div className="py-6">
      <Form {...listForm}>
        <form onSubmit={listForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={listForm.control}
            name="tokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Id</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="vehicle token id"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>
                  This is the token id of the vehicle.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={listForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="ex 1.2 BNB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={listForm.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms and Conditions</FormLabel>
                <FormControl>
                  <Input
                    placeholder="rental terms and conditions..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={listForm.control}
            name="durationFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date From</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="rental terms and conditions..."
                    {...field}
                    // value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={listForm.control}
            name="durationTill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Till</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="rental terms and conditions..."
                    {...field}
                    // value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ListForm;
