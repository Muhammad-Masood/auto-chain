"use client";

import { mintFormSchema } from "@/lib/schema";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Upload } from "lucide-react";
import {
  TransactionError,
  Web3Button,
  useAddress,
  useContract,
  useContractWrite,
  useStorageUpload,
} from "@thirdweb-dev/react";
import { rentalABI, rentalContractAddress } from "@/contract/ContractInfo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const MintForm = () => {
  const [image, setImage] = useState();
  const router = useRouter();
  const { mutateAsync: upload } = useStorageUpload();
  const { contract, isLoading, error } = useContract(
    rentalContractAddress,
    rentalABI
  );
  const address = useAddress();

  const form = useForm<z.infer<typeof mintFormSchema>>({
    resolver: zodResolver(mintFormSchema),
    defaultValues: {
      image: "",
      make: "Brand",
      model: "Model",
      yearOfManufacture: 2022,
      bodyType: "Sedan",
      exteriorColor: "Blue",
      interiorColor: "Beige",
      engineType: "V6",
      engineSize: "2.5L",
      horsepower: 250,
      torque: 300,
      transmissionType: "Automatic",
      drivetrain: "AWD",
      length: 4800,
      width: 1850,
      height: 1500,
      seatingCapacity: 5,
      cargoSpace: "20 cubic feet",
      numberOfAirbags: 6,
      basicSafetySystems: "ABS, Airbags",
      climateControlType: "Dual-zone automatic",
      infotainmentSystemBasics: "Touchscreen, Bluetooth",
      seatingMaterial: "Leather",
      lastMajorService: "January 2023",
      majorRepairs: "None",
      kilometersRun: 50000,
      numberOfPreviousOwners: 2,
      warrantyStatus: "Valid",
      legalDisclaimers: "No accidents reported",
    },
  });

  async function onSubmit(values: z.infer<typeof mintFormSchema>) {
    if (!address) {
      toast.error("Connect your wallet!");
    } else {
      toast.loading("Preparing your Vehicle NFT...");
      try {
      const uri: string[] = await upload({ data: [image!] });
      values.image = uri[0];
      const serializedMetadata = JSON.stringify(values, null, 2);
      const metadataURI: string[] = await upload({
        data: [serializedMetadata],
      });
      console.log(metadataURI[0]);
      // mint nft
        toast.dismiss();
        const transToastId = toast.loading("Waiting for transaction confirmation...");
        const result = await contract!.call("mint", [metadataURI[0], address]);
        toast.dismiss();
        console.log(result.receipt.transationHash);
        toast.success(
          "Vehicle Minted successfully!",
          result.receipt.transationHash
        );
        toast.dismiss(transToastId);
        router.replace('/admin/mint');
      } catch (e) {
        toast.dismiss();
        const errorReason:string = (e as TransactionError)?.reason;
        toast.error(errorReason);
        console.log("Execution reverted with reason:", errorReason);
      }
    }
  }

  const handleFileUpload = (event: any) => {
    setImage(event.target.files[0]);
  };

  const formFields: string[] = Object.keys(mintFormSchema.shape);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 space-x-8"
      >
        {formFields.map((section: any, index: number) => (
          <FormField
            key={index}
            control={form.control}
            name={section}
            render={({ field }) => (
              <FormItem className={`${section === "image" ? "pl-7" : ""}`}>
                <FormLabel className="capitalize">{section}</FormLabel>
                <FormControl>
                  {section === "image" ? (
                    <Card className="h-44 flex items-center justify-center w-44">
                      <label className="opacity-45 cursor-pointer">
                        <Input
                          type="file"
                          {...field}
                          className="hidden"
                          value={field.value}
                          onChange={handleFileUpload}
                        />
                        {image ? (
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`${section}_${field}`}
                            width="130"
                            height="130"
                          />
                        ) : (
                          <Upload className="w-16 h-16" />
                        )}
                      </label>
                    </Card>
                  ) : typeof field.value === "number" ? (
                    <Input
                      placeholder={section}
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  ) : (
                    <Input placeholder={section} {...field} />
                  )}
                </FormControl>
                {section === "image" && (
                  <FormDescription>This will be the car NFT</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default MintForm;
