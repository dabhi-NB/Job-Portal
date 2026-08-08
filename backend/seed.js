import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import connectDB from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const seedData = async () => {
    // Clear existing jobs and demo users to ensure clean seed
    await Job.deleteMany({ title: { $exists: true } });

    // 1. Create or fetch 2 Employer Accounts
    let employer1 = await User.findOne({ email: 'employer1@example.com' });
    if (!employer1) {
        employer1 = await User.create({
            name: 'Aarav Patel',
            email: 'employer1@example.com',
            password: '123456',
            role: 'employer'
        });
    }

    let employer2 = await User.findOne({ email: 'employer2@example.com' });
    if (!employer2) {
        employer2 = await User.create({
            name: 'Vikram Mehta',
            email: 'employer2@example.com',
            password: '123456',
            role: 'employer'
        });
    }

    // 2. Create or fetch 2 Candidate Accounts
    let candidate1 = await User.findOne({ email: 'candidate1@example.com' });
    if (!candidate1) {
        candidate1 = await User.create({
            name: 'Meera Shah',
            email: 'candidate1@example.com',
            password: '123456',
            role: 'candidate'
        });
    }

    let candidate2 = await User.findOne({ email: 'candidate2@example.com' });
    if (!candidate2) {
        candidate2 = await User.create({
            name: 'Rohan Sharma',
            email: 'candidate2@example.com',
            password: '123456',
            role: 'candidate'
        });
    }

    // 3. Create 10 Job Listings (distributed between Employer 1 and Employer 2)
    const jobs = [
        {
            title: 'Senior Frontend Developer',
            company: 'Websoft Labs',
            description: 'Build modern responsive web interfaces using React 19, Tailwind CSS, and TypeScript for global SaaS products.',
            location: 'Ahmedabad',
            salary: 75000,
            skills: ['React', 'Tailwind CSS', 'TypeScript', 'Redux'],
            postedBy: employer1._id
        },
        {
            title: 'Node.js Backend Engineer',
            company: 'CloudNest Systems',
            description: 'Work on scalable microservices, REST APIs, MongoDB architecture, and JWT authentication for cloud platforms.',
            location: 'Remote',
            salary: 85000,
            skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
            postedBy: employer1._id
        },
        {
            title: 'Full Stack MERN Developer',
            company: 'Websoft Labs',
            description: 'Develop end-to-end web applications with React frontend and Node/Express backend. Maintain high performance and clean code.',
            location: 'Mumbai',
            salary: 92000,
            skills: ['React', 'Node.js', 'Express', 'MongoDB'],
            postedBy: employer1._id
        },
        {
            title: 'UI/UX Product Designer',
            company: 'Pixel Studio',
            description: 'Design intuitive UI wireframes, design systems, and interactive Figma prototypes for web and mobile platforms.',
            location: 'Bengaluru',
            salary: 68000,
            skills: ['Figma', 'Wireframes', 'Design Systems', 'User Research'],
            postedBy: employer1._id
        },
        {
            title: 'DevOps & Cloud Engineer',
            company: 'CloudNest Systems',
            description: 'Manage AWS infrastructure, Docker containerization, CI/CD pipelines, and automated server deployments.',
            location: 'Remote',
            salary: 98000,
            skills: ['AWS', 'Docker', 'CI/CD', 'Kubernetes'],
            postedBy: employer1._id
        },
        {
            title: 'AI / Python Developer',
            company: 'Innovate AI',
            description: 'Develop machine learning pipelines, LLM integrations, and Python REST APIs for next-gen automation products.',
            location: 'Pune',
            salary: 105000,
            skills: ['Python', 'FastAPI', 'Machine Learning', 'PyTorch'],
            postedBy: employer2._id
        },
        {
            title: 'Mobile App Developer (React Native)',
            company: 'Nexus Mobility',
            description: 'Create cross-platform iOS and Android mobile apps with smooth animations, push notifications, and offline support.',
            location: 'Delhi',
            salary: 70000,
            skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
            postedBy: employer2._id
        },
        {
            title: 'QA Automation Engineer',
            company: 'Nexus Mobility',
            description: 'Write automated unit tests, integration tests, and end-to-end Selenium/Playwright browser automation suites.',
            location: 'Remote',
            salary: 60000,
            skills: ['Jest', 'Playwright', 'Selenium', 'JavaScript'],
            postedBy: employer2._id
        },
        {
            title: 'Product Manager',
            company: 'Innovate AI',
            description: 'Lead product roadmaps, sprint planning, feature prioritization, and collaborate closely with engineering and design teams.',
            location: 'Bengaluru',
            salary: 115000,
            skills: ['Product Strategy', 'Agile', 'Jira', 'Analytics'],
            postedBy: employer2._id
        },
        {
            title: 'Junior Web Developer',
            company: 'Nexus Mobility',
            description: 'Assist in building client landing pages, fixing UI bugs, and maintaining HTML/CSS/JavaScript components.',
            location: 'Ahmedabad',
            salary: 45000,
            skills: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
            postedBy: employer2._id
        }
    ];

    await Job.insertMany(jobs);

    console.log('✅ Seed successful!');
    console.log('----------------------------------------------------');
    console.log('📌 Employer Accounts (Password: 123456):');
    console.log('  1. Aarav Patel   -> employer1@example.com');
    console.log('  2. Vikram Mehta  -> employer2@example.com');
    console.log('');
    console.log('📌 Candidate Accounts (Password: 123456):');
    console.log('  1. Meera Shah    -> candidate1@example.com');
    console.log('  2. Rohan Sharma  -> candidate2@example.com');
    console.log('----------------------------------------------------');
    console.log('📌 Total Jobs Inserted: 10 listings');
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
