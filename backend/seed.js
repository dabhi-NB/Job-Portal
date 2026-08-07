import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import connectDB from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const seedData = async () => {
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
        console.log(`Seed skipped: ${existingJobs} job(s) already exist`);
        return;
    }

    let employer = await User.findOne({ email: 'employer@example.com' });
    if (!employer) {
        employer = await User.create({
            name: 'Aarav Patel',
            email: 'employer@example.com',
            password: '123456',
            role: 'employer'
        });
    }

    const candidate = await User.findOne({ email: 'candidate@example.com' });
    if (!candidate) {
        await User.create({
            name: 'Meera Shah',
            email: 'candidate@example.com',
            password: '123456',
            role: 'candidate'
        });
    }

    await Job.insertMany([
        {
            title: 'Frontend Developer',
            company: 'Websoft Labs',
            description: 'Build modern responsive interfaces for client products and internal dashboards.',
            location: 'Ahmedabad',
            salary: 48000,
            skills: ['React', 'CSS', 'JavaScript'],
            postedBy: employer._id
        },
        {
            title: 'Node.js Backend Engineer',
            company: 'CloudNest',
            description: 'Work on APIs, authentication, and scalable backend services for a growing SaaS platform.',
            location: 'Remote',
            salary: 62000,
            skills: ['Node.js', 'Express', 'MongoDB'],
            postedBy: employer._id
        },
        {
            title: 'UI/UX Designer',
            company: 'Pixel Studio',
            description: 'Create user-friendly layouts and interactive prototypes for mobile and web experiences.',
            location: 'Mumbai',
            salary: 54000,
            skills: ['Figma', 'Wireframes', 'Design Systems'],
            postedBy: employer._id
        }
    ]);

    console.log('Seed data inserted for employer and candidate demo accounts');
    console.log(`Demo login: employer@example.com / 123456`);
    console.log(`Demo login: candidate@example.com / 123456`);
};

export default seedData;

if (fileURLToPath(import.meta.url) === process.argv[1]) {
    connectDB()
        .then(() => seedData())
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
