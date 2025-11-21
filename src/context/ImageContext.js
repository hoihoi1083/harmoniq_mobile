"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ImageContext = createContext();

export function ImageProvider({ children }) {
	const [preview, setPreview] = useState(null);
	const [file, setFile] = useState(null);

	// Load image from localStorage on component mount
	useEffect(() => {
		try {
			const savedPreview = localStorage.getItem("savedImagePreview");
			if (savedPreview) {
				setPreview(savedPreview);
			}
		} catch (error) {}
	}, []);

	// Custom setPreview function that also saves to localStorage
	const setPreviewWithStorage = (newPreview) => {
		setPreview(newPreview);
		try {
			if (newPreview) {
				localStorage.setItem("savedImagePreview", newPreview);
			} else {
				localStorage.removeItem("savedImagePreview");
			}
		} catch (error) {}
	};

	// Custom setFile function that also handles preview
	const setFileWithPreview = (newFile) => {
		setFile(newFile);

		if (newFile) {
			// Create preview URL and save it
			const reader = new FileReader();
			reader.onload = (e) => {
				const previewUrl = e.target.result;
				setPreviewWithStorage(previewUrl);
			};
			reader.readAsDataURL(newFile);
		} else {
			setPreviewWithStorage(null);
		}
	};

	// Function to clear all image data
	const clearImages = () => {
		setPreview(null);
		setFile(null);
		try {
			localStorage.removeItem("savedImagePreview");
		} catch (error) {}
	};

	return (
		<ImageContext.Provider
			value={{
				preview,
				setPreview: setPreviewWithStorage,
				file,
				setFile: setFileWithPreview,
				clearImages,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
}

export function useImage() {
	const context = useContext(ImageContext);
	if (!context) {
		throw new Error("useImage must be used within an ImageProvider");
	}
	return context;
}
