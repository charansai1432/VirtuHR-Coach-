import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ScenarioModel } from './models/scenarioModel.js';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://charansaisita2028:u2yfS8S2vUHw8Xb3@cluster0.qbniyyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed data for scenarios
const scenarios = [
  // Basic Level Scenarios
  {
    question: "How would you handle a situation where an employee consistently arrives late to work?",
    level: "basic",
    category: "Performance Management"
  },
  {
    question: "A team member is struggling with their workload. How would you approach this situation?",
    level: "basic",
    category: "Work-Life Balance"
  },
  {
    question: "Describe how you would onboard a new employee in their first week.",
    level: "basic",
    category: "Onboarding"
  },
  {
    question: "How would you communicate a change in company policy to your team?",
    level: "basic",
    category: "Communication"
  },
  {
    question: "An employee is consistently missing deadlines. How would you address this?",
    level: "basic",
    category: "Performance Management"
  },
  
  // Intermediate Level Scenarios
  {
    question: "Two team members are having a conflict that's affecting team morale. How would you mediate this situation?",
    level: "intermediate",
    category: "Conflict Resolution"
  },
  {
    question: "A valuable employee has received a job offer from another company. How would you handle this retention challenge?",
    level: "intermediate",
    category: "Retention"
  },
  {
    question: "How would you address an employee who has good technical skills but is creating interpersonal issues within the team?",
    level: "intermediate",
    category: "Team Dynamics"
  },
  {
    question: "An employee has raised concerns about potential discrimination in the workplace. What steps would you take?",
    level: "intermediate",
    category: "Diversity & Inclusion"
  },
  {
    question: "A team is resistant to adopting a new technology or process. How would you manage this change?",
    level: "intermediate",
    category: "Change Management"
  },
  
  // Advanced Level Scenarios
  {
    question: "You need to reduce your department headcount by 15%. How would you approach this restructuring process?",
    level: "advanced",
    category: "Restructuring"
  },
  {
    question: "A high-performing manager in your organization has been accused of favoritism. How would you investigate and address this situation?",
    level: "advanced",
    category: "Leadership Ethics"
  },
  {
    question: "How would you design a diversity and inclusion initiative for a company that has historically struggled with representation?",
    level: "advanced",
    category: "Diversity & Inclusion"
  },
  {
    question: "Your company is merging with another organization with a very different culture. How would you lead your team through this transition?",
    level: "advanced",
    category: "Organizational Change"
  },
  {
    question: "An employee has shared that they're dealing with a serious mental health issue. How would you support them while ensuring business needs are met?",
    level: "advanced",
    category: "Employee Wellbeing"
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing scenarios
    await ScenarioModel.deleteMany({});
    
    // Insert new scenarios
    await ScenarioModel.insertMany(scenarios);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();