import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Helper: escape regex special characters to prevent NoSQL injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createJob = async (req, res, next) => {
    try {
        const { title, company, description, location, salary, skills } = req.body;

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary,
            skills: skills || [],
            postedBy: req.user._id
        });

        res.status(201).json({ success: true, job });
    } catch (error) {
        next(error);
    }
};

const getAllJobs = async (req, res, next) => {
    try {
        const { search, location, skills, minSalary, maxSalary, page = 1, limit = 10 } = req.query;

        const query = {};

        if (search) {
            const safe = escapeRegex(search);
            query.$or = [
                { title: { $regex: safe, $options: 'i' } },
                { company: { $regex: safe, $options: 'i' } }
            ];
        }

        if (location) query.location = { $regex: escapeRegex(location), $options: 'i' };
        if (skills) {
            const skillArray = skills.split(',').map((skill) => skill.trim()).filter(Boolean);
            if (skillArray.length) query.skills = { $in: skillArray };
        }
        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = Number(minSalary);
            if (maxSalary) query.salary.$lte = Number(maxSalary);
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Job.countDocuments(query);

        res.status(200).json({ success: true, jobs, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
        next(error);
    }
};

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only update your own jobs' });
        }

        // Whitelist allowed fields — prevent overwriting postedBy or other protected fields
        const { title, company, description, location, salary, skills } = req.body;
        const allowedUpdates = {};
        if (title !== undefined) allowedUpdates.title = title;
        if (company !== undefined) allowedUpdates.company = company;
        if (description !== undefined) allowedUpdates.description = description;
        if (location !== undefined) allowedUpdates.location = location;
        if (salary !== undefined) allowedUpdates.salary = salary;
        if (skills !== undefined) allowedUpdates.skills = skills;

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
        res.status(200).json({ success: true, job: updatedJob });
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only delete your own jobs' });
        }

        // Cascade delete: remove all applications tied to this job so no orphaned records remain
        await Application.deleteMany({ jobId: req.params.id });

        await job.deleteOne();
        res.status(200).json({ success: true, message: 'Job and its applications deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export { createJob, getAllJobs, getJobById, updateJob, deleteJob };