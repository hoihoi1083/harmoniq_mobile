import bcrypt from "bcryptjs";

export async function hashPassword(password) {
	const saltRounds = 12;
	return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password) {
	// Password must be at least 8 characters long and contain at least one letter and one number
	const minLength = 8;
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /\d/.test(password);

	return {
		isValid: password.length >= minLength && hasLetter && hasNumber,
		message:
			password.length < minLength
				? "Password must be at least 8 characters long"
				: !hasLetter || !hasNumber
					? "Password must contain at least one letter and one number"
					: "",
	};
}

export function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return {
		isValid: emailRegex.test(email),
		message: !emailRegex.test(email)
			? "Please enter a valid email address"
			: "",
	};
}
