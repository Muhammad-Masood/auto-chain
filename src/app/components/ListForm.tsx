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
import { useAddress, useContract } from "@thirdweb-dev/react";
import toast from "react-hot-toast";

const ListForm = () => {
  const [date, setDate] = useState<Date>();
  const address = useAddress();
  const { contract } = useContract(rentalContractAddress, rentalABI);

  const listForm = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema),
  });

  async function onSubmit(values: z.infer<typeof listFormSchema>) {
    console.log(values);
    toast.loading("Waiting for transaction confirmation...");
    const {price, durationFrom, durationTill, terms} = values;
    const listedVehicle = await contract!.call("list", [values.tokenId, {price, durationFrom, durationTill, terms}]);
    console.log(listedVehicle);
    toast.dismiss();
    toast.success("Vehicle listed successfully for rent!");
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
                  <Input
                    type="number"
                    placeholder="ex 1.2 BNB"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        {...field}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={listForm.control}
            name="durationTill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Till</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          /> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ListForm;
