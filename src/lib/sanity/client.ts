import imageUrlBuilder from "@sanity/image-url";

import { createClient } from "@sanity/client";
// client safe config
export const config = {
  projectId: "tpg7av64",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};
export const client = createClient(config);

// admin level config, used for backend
const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN,
};
export const adminClient = createClient(adminConfig);

// Image url builder

const builder = imageUrlBuilder(config);
export const urlFor = (source: string) => builder.image(source);
