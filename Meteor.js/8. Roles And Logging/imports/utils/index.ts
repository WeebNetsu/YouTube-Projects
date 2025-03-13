/**
 * This will convert an image into a buffer.
 *
 * @param file File object to encode
 * @returns string buffer
 */
export const encodeImageFileAsURL = (
	file: File
): Promise<string | ArrayBuffer | null> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};
