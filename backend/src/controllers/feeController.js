/**
 * @file feeController.js
 * @description Handles HTTP requests for fee records.
 *
 * Responsibilities:
 * - Pass fee CRUD requests and filters to the fee service.
 * - Return paginated results and operation responses.
 */
import {
  createFeeService,
  deleteFeeService,
  getFeeService,
  listFeesService,
  updateFeeService,
} from "../services/feeService.js";
import { getPagination } from "../utils/pagination.js";

export const createFee = async (req, res, next) => {
  try {
    const fee = await createFeeService(req.body, req.user, req.ip);
    return res.status(201).json({ success: true, data: fee });
  } catch (error) { return next(error); }
};

export const listFees = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const result = await listFeesService(req.user, page, limit, req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) { return next(error); }
};

export const getFee = async (req, res, next) => {
  try {
    const fee = await getFeeService(req.params.id, req.user);
    return res.status(200).json({ success: true, data: fee });
  } catch (error) { return next(error); }
};

export const updateFee = async (req, res, next) => {
  try {
    const fee = await updateFeeService(req.params.id, req.body, req.user, req.ip);
    return res.status(200).json({ success: true, data: fee });
  } catch (error) { return next(error); }
};

export const deleteFee = async (req, res, next) => {
  try {
    const result = await deleteFeeService(req.params.id, req.user, req.ip);
    return res.status(200).json(result);
  } catch (error) { return next(error); }
};