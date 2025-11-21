import mongoose from "mongoose";

const checkoutSessionSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
	},
	isFullfilled: {
		type: Boolean,
		default: false,
	},
	paymentType: {
		type: String,
		enum: ["regular", "fortune", "expert188", "expert88", "couple"],
		default: "regular",
	},
	concern: {
		type: String,
		enum: ["financial", "love", "health", "career"],
		required: function () {
			return this.paymentType === "fortune";
		},
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
const CheckoutSession =
	mongoose.models.CheckoutSession ||
	mongoose.model("CheckoutSession", checkoutSessionSchema);

export default CheckoutSession;
