import express from 'express';
import { applyForJob, getMyApplications, getApplicationsForJob, getEmployerApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import uploadResume from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('candidate'), uploadResume.single('resumeFile'), applyForJob);
router.get('/my', authMiddleware, authorizeRoles('candidate'), getMyApplications);
router.get('/employer', authMiddleware, authorizeRoles('employer'), getEmployerApplications);
router.get('/job/:jobId', authMiddleware, authorizeRoles('employer'), getApplicationsForJob);
router.patch('/:id', authMiddleware, authorizeRoles('employer'), updateApplicationStatus);

export default router;
