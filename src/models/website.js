import mongoose from "mongoose";

const WebsiteSchema = new mongoose.Schema({
  domainName: {
    type: String,
    required: true,
  },
  IPAddress: {
    type: String,
    required: true,
  },
  hostingProvider: {
    type: String,
    required: true,
  },
  globalRanking: {
    type: Number,
    required: true,
  },
});

export const Website =
  mongoose.models.Website || mongoose.model("Website", WebsiteSchema);
