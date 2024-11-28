import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import autoIncrementFactory from 'mongoose-sequence';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();

const app = express();
app.use(express.json());

import cors from 'cors';

// More specific CORS configuration
app.use(cors({
  origin: [
    'https://talent-portal-seven.vercel.app',
    'https://talent-apply.vercel.app'    
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Origin', 
    'Access-Control-Allow-Headers'
  ],
  credentials: true
}));

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "Frontend", "New", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "New", "dist", "index.html"));
});

// Define auto-increment plugin with mongoose
const autoIncrement = autoIncrementFactory(mongoose);

const applicantSchema = new mongoose.Schema({
    applicantId: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Add the auto-increment plugin
applicantSchema.plugin(autoIncrement, { inc_field: 'applicantId' });

const Applicant = mongoose.model('Applicant', applicantSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Decoded user:', req.user); // Log the decoded user
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Define the signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Applicant.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newApplicant = new Applicant({
            name,
            email,
            password,
        });

        await newApplicant.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Fetch applicant details and application created date

// Fetch applicant details and application created date
app.get('/api/applicants/:applicantId', async (req, res) => {
    const { applicantId } = req.params;

    try {
        const applicant = await Applicant.findOne({ applicantId });

        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        res.json({
            applicantId: applicant.applicantId, // Include applicantId in the response
            name: applicant.name,
            email: applicant.email,
        });
    } catch (error) {
        console.error('Error fetching applicant details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Applicant.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ applicantId: user.applicantId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Include applicantId in the response
        res.status(200).json({ message: 'Login successful', token, name: user.name, applicantId: user.applicantId });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});


const jobSchema = new mongoose.Schema({
    jobId: {
        type: Number,
        unique: true,
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: [String],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Apply the auto-increment plugin to the jobId field
jobSchema.plugin(autoIncrement, { inc_field: 'jobId' });

const Job = mongoose.model('Job', jobSchema);

app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findOne({ jobId: Number(jobId) });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.post('/api/jobs', async (req, res) => {
    const { jobTitle, jobLocation, jobDescription } = req.body;

    if (!jobTitle || !jobLocation || !jobDescription) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const newJob = new Job({
        jobTitle,
        jobLocation,
        jobDescription
    });

    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const applicationSchema = new mongoose.Schema({
    applicationId: {
        type: Number,
        unique: true,
    },
    jobId: {
        type: Number,
        required: true,
        ref: 'Job'
    },
    applicantId: {
        type: Number,
        required: true,
        ref: 'Applicant'
    },
    contactNumber: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    linkedinProfile: {
        type: String,
        required: false
    },
    resume: {
        type: Buffer,
        required: true
    },
    resumeType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'under review' // Default value for the status field
    }
});


applicationSchema.plugin(autoIncrement, { inc_field: 'applicationId' });

const Application = mongoose.model('Application', applicationSchema);

// Set up multer for memory storage
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create an application
app.post('/api/apply/:jobId', authenticate, upload.single('resume'), async (req, res) => {
    const { jobId } = req.params;
    const { contactNumber, technology, linkedinProfile, applicantId } = req.body;

    // Check if jobId is a valid ObjectId or a number
    if (!mongoose.Types.ObjectId.isValid(jobId) && isNaN(jobId)) {
        return res.status(400).json({ message: 'Invalid jobId format' });
    }

    if (!applicantId) {
        return res.status(400).json({ message: 'Applicant ID is required' });
    }

    try {
        // Convert jobId to ObjectId if it's valid, otherwise treat it as an integer
        const jobObjectId = mongoose.Types.ObjectId.isValid(jobId) 
            ? new mongoose.Types.ObjectId(jobId) 
            : null;

        const resumeBuffer = req.file.buffer; // Read the PDF file as a Buffer
        const resumeType = req.file.mimetype; // Get the MIME type

        const application = new Application({
            jobId: jobObjectId || jobId, // Use jobId as-is if it's an integer
            applicantId, // Now use the applicantId from req.body instead of req.user
            contactNumber,
            technology,
            linkedinProfile,
            resume: resumeBuffer, // Store the buffer
            resumeType // Store the MIME type
        });

        await application.save();
        
        // Return success message along with applicantId
        return res.status(201).json({ 
            message: 'Application submitted successfully!', 
            applicantId // Include applicantId in the response
        });
    } catch (error) {
        console.error('Error saving application:', error);
        return res.status(500).json({ message: 'Error submitting application' });
    }
});


// Route to retrieve application and download PDF
app.get('/api/application/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.set('Content-Type', application.resumeType); // Set the appropriate MIME type
        res.send(application.resume); // Send the buffer as the response
    } catch (error) {
        console.error('Error retrieving application:', error);
        return res.status(500).json({ message: 'Error retrieving application' });
    }
});

app.get('/api/applications', async (req, res) => {
    const { applicantId } = req.query;

    if (!applicantId) {
        return res.status(400).json({ error: 'Applicant ID is required' });
    }

    try {
        const applications = await Application.find({ applicantId });
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'An error occurred while fetching applications' });
    }
});


// Update application status
app.patch('/api/applications/:applicationId/status', async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate the status value
    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be "accepted" or "rejected".' });
    }

    try {
        const application = await Application.findOneAndUpdate(
            { applicationId },
            { status }, // Update the status
            { new: true } // Return the updated application
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application status updated successfully', application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

app.get('/applications/:applicationId/resume', async (req, res) => {
    try {
        const application = await Application.findOne({ applicationId: req.params.applicationId });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure the resume type is set to PDF
        res.set('Content-Type', 'application/pdf'); // Set the content type to PDF
        res.set('Content-Disposition', `attachment; filename=resume-${application.applicationId}.pdf`); // Set the filename
        res.send(application.resume); // Send the resume buffer
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Error fetching resume' });
    }
});