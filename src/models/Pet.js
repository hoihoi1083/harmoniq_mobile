import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		ref: "User",
	},
	type: {
		type: String,
		enum: ["猫", "狗", "兔子", "蛇", "蜥蜴", "鳥類", "觀賞魚"],
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	birthDateTime: {
		type: Date,
		required: true,
	},
	gender: {
		type: String,
		enum: ["雄性", "雌性", "未知"],
		default: "未知",
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
PetSchema.index({ userId: 1 });

export default mongoose.models.Pet || mongoose.model("Pet", PetSchema);
