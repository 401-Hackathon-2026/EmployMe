export interface ResumeData {
    phone: string;
    name: string;
    email: string;
    linkedin: string;
    github: string;
    education: Array<{
        school: string;
        degree: string;
        year: string;
        location: string;
    }>;
    experience: Array<{
        title: string;
        date: string;
        company: string,
        points: Array<string>;
        location: string
    }>;
    projects: Array<{
        name: string;
        technologies: string;
        date: string;
        link: string;
        points: Array<string>;
    }>;
    skills: {
        languages: string;
        frameworks: string;
        tools: string;
        libraries: string;
    };
}

export const initialResumeState: ResumeData = {
  name: "Jake Ryan",
  email: "jake@uwaterloo.ca",
  phone: "123-456-7890",
  linkedin: "linkedin.com/in/jake",
  github: "github.com/jake",
  education: [
    { 
        school: "Southwestern University",
        degree: "BS Computer Science",
        year: "2024",
        location: "Georgetown, TX"
    }
  ],
  experience: [
    {
        title: "Undergraduate Research Assistant",
        company: "Texas A&M University",
        date: "2024",
        points: [
            "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
            "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
            "Explored ways to visualize GitHub collaboration in a classroom setting"
        ],
        location: "Texas"
    }
  ],
  projects: [
    {
        name: "Gitlytics",
        technologies: "Python, Flask, React, PostgreSQL, Docker",
        date: "2024",
        link: "",
        points: [
            "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
            "Implemented GitHub OAuth to get data from user’s repositories",
            "Visualized GitHub data to show collaboration",
            "Used Celery and Redis for asynchronous tasks"
        ]
    }
  ],
  skills: {
    languages: "Java, Python",
    frameworks: "React",
    tools: "Git, Docker",
    libraries: "pandas, NumPy"
  }
};