import mongoose from "mongoose";

const FamilyMemberSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		ref: "User",
	},
	gender: {
		type: String,
		enum: ["female", "male"],
		required: true,
	},
	birthDateTime: {
		type: Date,
		required: true,
	},
	relationship: {
		type: String,
		default: "family_member",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Index for efficient queries
FamilyMemberSchema.index({ userId: 1 });

export default mongoose.models.FamilyMember ||
	mongoose.model("FamilyMember", FamilyMemberSchema);
