import Application from '../models/Application.js';
import Job from '../models/Job.js';

const applyForJob = async (req, res, next) => {
    try {
        const { jobId, resume } = req.body;

        if (!jobId || !resume) {
            return res.status(400).json({ success: false, message: 'Job ID and resume are required' });
        }

        const existing = await Application.findOne({ jobId, candidateId: req.user._id });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You already applied for this job' });
        }

        const application = await Application.create({
            jobId,
            candidateId: req.user._id,
            resume
        });

        res.status(201).json({ success: true, application });
    } catch (error) {
        next(error);
    }
};

const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidateId: req.user._id })
            .populate('jobId')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, applications });
    } catch (error) {
        next(error);
    }
};

const getApplicationsForJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only view applications for your own jobs' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('candidateId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, applications });
    } catch (error) {
        next(error);
    }
};

const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only update applications for your own jobs' });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ success: true, application });
    } catch (error) {
        next(error);
    }
};

export { applyForJob, getMyApplications, getApplicationsForJob, updateApplicationStatus };
