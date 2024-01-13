import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
// .refine ((files) => {
//   return files?.[0]?.size <= MAX_FILE_SIZE;
// }, `Max image size is 5MB.`)
// .refine(
//   (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
//   "Only .jpg, .jpeg, .png and .webp formats are supported."
// ),


export const burnFormSchema = z.object({
  tokenId: z.number().gte(0),
})

export const mintFormSchema = z.object({
  // basicInformation: z.object({
  image: z.any(),
  model: z.string().min(3).max(50),
  make: z.string().min(3).max(50),
  yearOfManufacture: z.number().gt(1900),
  bodyType: z.string().min(3),
  exteriorColor: z.string(),
  interiorColor: z.string(),

  engineType: z.string(),
  engineSize: z.string(),
  horsepower: z.number().gt(0),
  torque: z.number().gt(0),
  transmissionType: z.string(),
  drivetrain: z.string(),

  length: z.number().gt(0),
  width: z.number().gt(0),
  height: z.number().gt(0),
  seatingCapacity: z.number().gt(0),
  cargoSpace: z.string(),

  numberOfAirbags: z.number().gte(0),
  basicSafetySystems: z.string(),

  climateControlType: z.string(),
  infotainmentSystemBasics: z.string(),
  seatingMaterial: z.string(),

  lastMajorService: z.string(),
  majorRepairs: z.string(),
  kilometersRun: z.number(), // Added kilometers run
  numberOfPreviousOwners: z.number(),
  warrantyStatus: z.string(),
  legalDisclaimers: z.string(),
  // address: z.string().min(42).max(42, { message: "Invalid wallet address" }),
});


export const listFormSchema = z.object({
  tokenId: z.number().gte(0),
  price: z.string().refine((value) => {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0;
  }, { message: "Invalid rent price" }),
  terms: z.string(),
  durationFrom: z.string(),
  durationTill: z.string(),
});