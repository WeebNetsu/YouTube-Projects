/**
 * This will check that a string contains only letters and numbers
 *
 * @param str string to check
 * @param allowUnderscore if the string should allow underscore
 * @returns true if string does not contain any special characters
 */
export const stringContainsOnlyLettersAndNumbers = (
	str: string,
	allowUnderscore?: boolean
) => {
	if (allowUnderscore) return /^[A-Za-z0-9_]*$/.test(str);

	return /^[A-Za-z0-9]*$/.test(str);
};
