"use client";

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
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import { burnFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionError, useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const BurnForm = () => {
  const router = useRouter();
  const { contract, isLoading, error } = useContract(
    rentalContractAddress,
    rentalABI
  );
  const address = useAddress();

  const form = useForm<z.infer<typeof burnFormSchema>>({
    resolver: zodResolver(burnFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof burnFormSchema>) => {
    if (!address) {
      toast.error("Connect your wallet!");
    } else {
      try {
        toast.loading("Waiting for transaction confirmation...");
        const result = await contract!.call("burn", [values.tokenId]);
        toast.dismiss();
        console.log(result.receipt.transationHash);
        toast.success(
          "NFT burned successfully!",
          result.receipt.transationHash
        );
        router.refresh();
      } catch (e) {
        toast.dismiss();
        const errorReason: string = (e as TransactionError)?.reason;
        toast.error(errorReason);
        console.log("Execution reverted with reason:", errorReason);
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    {...field}
                    type="number"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>This is the nft token id.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button >Submit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this nft from the blockchain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" onClick={form.handleSubmit(onSubmit)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
};

export default BurnForm;
