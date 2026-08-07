import express from 'express';
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('employer'), createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.put('/:id', authMiddleware, authorizeRoles('employer'), updateJob);
router.delete('/:id', authMiddleware, authorizeRoles('employer'), deleteJob);

export default router;
