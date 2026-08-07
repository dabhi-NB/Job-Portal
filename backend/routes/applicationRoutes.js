import express from 'express';
import { applyForJob, getMyApplications, getApplicationsForJob, updateApplicationStatus } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('candidate'), applyForJob);
router.get('/my', authMiddleware, authorizeRoles('candidate'), getMyApplications);
router.get('/job/:jobId', authMiddleware, authorizeRoles('employer'), getApplicationsForJob);
router.patch('/:id', authMiddleware, authorizeRoles('employer'), updateApplicationStatus);

export default router;
