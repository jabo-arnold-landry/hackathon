const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    names: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    complains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complain",
      },
    ],
    roles: {
      type: String,
      enum: ["citizen", "admin", "govmentAgent"],
      default: "citizen",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
const complainSchema = new mongoose.Schema(
  {
    complTitle: {
      type: String,
      required: true,
      trim: true,
    },
    complBody: {
      type: String,
      required: true,
      trim: true,
    },
    submittedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovInstitute",
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "responded"],
      default: "sent",
    },
  },
  { timestamps: true }
);
const Complain = mongoose.model("Complain", complainSchema);

const govIinstitute = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    complains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complains",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const GovInstitute = mongoose.model("GovInstitute", govIinstitute);
module.exports = { User, Complain, GovInstitute };
