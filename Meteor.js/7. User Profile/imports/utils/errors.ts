import { checkStrEmpty } from "@netsu/js-utils";
import { message } from "antd";
import { Meteor } from "meteor/meteor";
import React from "react";

/**
 * Displays the error with message.error and console logs the error.
 *
 * NOTE: This only works on the frontend, do not use in a Meteor method!
 *
 * @param err Error that was thrown
 * @param backupReason A reason to explain what the error is (in case err.reason is empty)
 * @param setShowErrorModal Set to true to show the error modal
 * @param setErrorPopupText Set to true to set the error popup text
 */
// eslint-disable-next-line import/prefer-default-export
export const errorResponse = (
	err: Meteor.Error,
	backupReason: string,
	setShowErrorModal?: React.Dispatch<React.SetStateAction<boolean>>,
	setErrorPopupText?: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
	if (setShowErrorModal && setErrorPopupText) {
		setShowErrorModal(true);
		setErrorPopupText(err.details ?? err.reason ?? backupReason);
	} else {
		message.error(err.details ?? err.reason ?? backupReason);
	}

	if (checkStrEmpty(err.details ?? err.reason)) {
		// in case the error is not in fact a meteor error
		console.error(err);
	}
};
