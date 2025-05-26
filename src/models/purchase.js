import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  submittedAt: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  transactionID: {
    type: String,
    required: true,
  },
});

export const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
