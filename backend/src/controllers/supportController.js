/**
 * @file supportController.js
 * @description Handles authenticated support-contact submissions.
 *
 * Responsibilities:
 * - Forward support subject and message data to the support service.
 * - Return the service result or pass errors to middleware.
 */
import {
  contactSupportService,
} from "../services/supportService.js";

const contactSupport = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await contactSupportService(
        req.user.id,
        req.body.subject,
        req.body.message
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export {
  contactSupport,
};