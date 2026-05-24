const NiksJobsData = {
  platformStats: {
    jobs: 28400,
    companies: 4200,
    successRate: 96,
    countries: 62,
    seekers: 890000,
    hiresMonthly: 12400
  },

  topLocations: [
    { city: 'San Francisco', country: 'USA', jobs: 2840, icon: '🌉' },
    { city: 'New York', country: 'USA', jobs: 3120, icon: '🗽' },
    { city: 'London', country: 'UK', jobs: 1980, icon: '🇬🇧' },
    { city: 'Bangalore', country: 'India', jobs: 2450, icon: '🇮🇳' },
    { city: 'Berlin', country: 'Germany', jobs: 1120, icon: '🇩🇪' },
    { city: 'Toronto', country: 'Canada', jobs: 980, icon: '🇨🇦' },
    { city: 'Singapore', country: 'Singapore', jobs: 870, icon: '🇸🇬' },
    { city: 'Sydney', country: 'Australia', jobs: 760, icon: '🇦🇺' },
    { city: 'Remote', country: 'Worldwide', jobs: 5200, icon: '🌍' },
    { city: 'Dubai', country: 'UAE', jobs: 640, icon: '🇦🇪' }
  ],

  careerTips: [
    { id: 't1', title: 'Tailor Your Resume for Each Role', excerpt: 'Highlight relevant skills and quantify achievements. ATS-friendly formatting increases interview callbacks by up to 40%.', icon: '📄', readTime: '4 min' },
    { id: 't2', title: 'Master the Virtual Interview', excerpt: 'Test your setup, maintain eye contact with the camera, and prepare concise STAR-method answers for behavioral questions.', icon: '🎥', readTime: '6 min' },
    { id: 't3', title: 'Negotiate Your Offer Confidently', excerpt: 'Research market salaries, consider total compensation, and practice articulating your value before the conversation.', icon: '💼', readTime: '5 min' },
    { id: 't4', title: 'Build Your Professional Network', excerpt: 'Engage on LinkedIn, attend industry meetups, and request informational interviews to uncover hidden opportunities.', icon: '🤝', readTime: '7 min' },
    { id: 't5', title: 'Switch Careers Strategically', excerpt: 'Identify transferable skills, complete targeted certifications, and craft a narrative that connects your past experience to new roles.', icon: '🔄', readTime: '8 min' },
    { id: 't6', title: 'Stand Out with a Portfolio', excerpt: 'Showcase 3–5 strong projects with context, your role, tech stack, and measurable outcomes for design and engineering roles.', icon: '✨', readTime: '5 min' }
  ],

  companies: [
    { id: 'c1', name: 'Google', logo: 'G', color: '#4285F4', industry: 'Technology', employees: '150,000+', website: 'https://google.com', about: 'Google\'s mission is to organize the world\'s information and make it universally accessible and useful.', location: 'Mountain View, CA' },
    { id: 'c2', name: 'Microsoft', logo: 'M', color: '#00A4EF', industry: 'Technology', employees: '220,000+', website: 'https://microsoft.com', about: 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.', location: 'Redmond, WA' },
    { id: 'c3', name: 'Amazon', logo: 'A', color: '#FF9900', industry: 'E-commerce', employees: '1,500,000+', website: 'https://amazon.com', about: 'Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.', location: 'Seattle, WA' },
    { id: 'c4', name: 'Meta', logo: 'F', color: '#0668E1', industry: 'Social Media', employees: '86,000+', website: 'https://meta.com', about: 'Meta builds technologies that help people connect, find communities, and grow businesses.', location: 'Menlo Park, CA' },
    { id: 'c5', name: 'Netflix', logo: 'N', color: '#E50914', industry: 'Entertainment', employees: '12,000+', website: 'https://netflix.com', about: 'Netflix is the world\'s leading streaming entertainment service.', location: 'Los Gatos, CA' },
    { id: 'c6', name: 'Stripe', logo: 'S', color: '#635BFF', industry: 'Fintech', employees: '8,000+', website: 'https://stripe.com', about: 'Stripe is a financial infrastructure platform for businesses.', location: 'San Francisco, CA' },
    { id: 'c7', name: 'Spotify', logo: '♪', color: '#1DB954', industry: 'Music', employees: '9,000+', website: 'https://spotify.com', about: 'Spotify transformed music listening forever when we launched in 2008.', location: 'Stockholm, Sweden' },
    { id: 'c8', name: 'Airbnb', logo: '⌂', color: '#FF5A5F', industry: 'Travel', employees: '6,000+', website: 'https://airbnb.com', about: 'Airbnb connects millions of people to unique travel experiences.', location: 'San Francisco, CA' },
    { id: 'c9', name: 'Apple', logo: 'A', color: '#555555', industry: 'Technology', employees: '164,000+', website: 'https://apple.com', about: 'Apple designs consumer electronics, software, and online services known for innovation and design excellence.', location: 'Cupertino, CA' },
    { id: 'c10', name: 'Tesla', logo: 'T', color: '#CC0000', industry: 'Automotive', employees: '140,000+', website: 'https://tesla.com', about: 'Tesla accelerates the world\'s transition to sustainable energy with electric vehicles and clean energy products.', location: 'Austin, TX' },
    { id: 'c11', name: 'Adobe', logo: 'Ad', color: '#FF0000', industry: 'Software', employees: '29,000+', website: 'https://adobe.com', about: 'Adobe empowers everyone to create, deliver, and optimize digital experiences through creative and document solutions.', location: 'San Jose, CA' },
    { id: 'c12', name: 'Salesforce', logo: 'Sf', color: '#00A1E0', industry: 'SaaS', employees: '72,000+', website: 'https://salesforce.com', about: 'Salesforce is the global leader in CRM, helping companies connect with customers in a whole new way.', location: 'San Francisco, CA' },
    { id: 'c13', name: 'IBM', logo: 'IBM', color: '#054ADA', industry: 'Technology', employees: '280,000+', website: 'https://ibm.com', about: 'IBM provides hybrid cloud, AI, and consulting solutions to enterprises worldwide.', location: 'Armonk, NY' },
    { id: 'c14', name: 'Deloitte', logo: 'D', color: '#86BC25', industry: 'Consulting', employees: '415,000+', website: 'https://deloitte.com', about: 'Deloitte delivers audit, consulting, tax, and advisory services to clients across industries globally.', location: 'London, UK' },
    { id: 'c15', name: 'Uber', logo: 'U', color: '#000000', industry: 'Mobility', employees: '32,000+', website: 'https://uber.com', about: 'Uber reimagines the way the world moves for the better through ride-hailing, delivery, and freight.', location: 'San Francisco, CA' },
    { id: 'c16', name: 'Shopify', logo: 'S', color: '#96BF48', industry: 'E-commerce', employees: '11,000+', website: 'https://shopify.com', about: 'Shopify powers millions of businesses with a complete commerce platform for online and retail sales.', location: 'Ottawa, Canada' }
  ],

  categories: [
    { id: 'tech', name: 'Technology', icon: '💻', count: 3240 },
    { id: 'design', name: 'Design', icon: '🎨', count: 856 },
    { id: 'marketing', name: 'Marketing', icon: '📈', count: 1278 },
    { id: 'finance', name: 'Finance', icon: '💰', count: 989 },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', count: 1412 },
    { id: 'education', name: 'Education', icon: '📚', count: 534 },
    { id: 'sales', name: 'Sales', icon: '🤝', count: 967 },
    { id: 'remote', name: 'Remote', icon: '🌍', count: 2890 },
    { id: 'engineering', name: 'Engineering', icon: '⚙️', count: 2100 },
    { id: 'data', name: 'Data Science', icon: '📊', count: 745 },
    { id: 'hr', name: 'Human Resources', icon: '👥', count: 412 },
    { id: 'legal', name: 'Legal', icon: '⚖️', count: 298 },
    { id: 'operations', name: 'Operations', icon: '📦', count: 623 },
    { id: 'customer', name: 'Customer Success', icon: '🎧', count: 501 },
    { id: 'product', name: 'Product', icon: '🚀', count: 892 },
    { id: 'internship', name: 'Internships', icon: '🎓', count: 1156 }
  ],

  jobs: [
    { id: 'j1', title: 'Senior Frontend Developer', companyId: 'c1', salary: '$140k - $180k', experience: '5+ years', location: 'Mountain View, CA', type: 'Full-time', remote: 'Hybrid', skills: ['React', 'TypeScript', 'CSS', 'Node.js'], posted: '2026-05-20', featured: true, description: 'Join our team to build next-generation web applications used by billions of users worldwide.' },
    { id: 'j2', title: 'Cloud Solutions Architect', companyId: 'c2', salary: '$160k - $200k', experience: '7+ years', location: 'Redmond, WA', type: 'Full-time', remote: 'Onsite', skills: ['Azure', 'Kubernetes', 'Terraform', 'Python'], posted: '2026-05-19', featured: true, description: 'Design and implement scalable cloud solutions for enterprise customers.' },
    { id: 'j3', title: 'Machine Learning Engineer', companyId: 'c3', salary: '$150k - $190k', experience: '4+ years', location: 'Seattle, WA', type: 'Full-time', remote: 'Hybrid', skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'], posted: '2026-05-18', featured: true, description: 'Build ML models that power recommendation systems and search ranking.' },
    { id: 'j4', title: 'Product Designer', companyId: 'c4', salary: '$120k - $155k', experience: '3+ years', location: 'Menlo Park, CA', type: 'Full-time', remote: 'Remote', skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'], posted: '2026-05-17', featured: false, description: 'Create intuitive and beautiful experiences for billions of users across Meta products.' },
    { id: 'j5', title: 'DevOps Engineer', companyId: 'c5', salary: '$130k - $170k', experience: '4+ years', location: 'Los Gatos, CA', type: 'Full-time', remote: 'Hybrid', skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'], posted: '2026-05-16', featured: false, description: 'Maintain and improve infrastructure supporting global streaming services.' },
    { id: 'j6', title: 'Backend Engineer', companyId: 'c6', salary: '$145k - $185k', experience: '5+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Remote', skills: ['Go', 'Ruby', 'PostgreSQL', 'Redis'], posted: '2026-05-15', featured: true, description: 'Build payment infrastructure that powers millions of businesses worldwide.' },
    { id: 'j7', title: 'Data Analyst', companyId: 'c7', salary: '$90k - $120k', experience: '2+ years', location: 'New York, NY', type: 'Full-time', remote: 'Hybrid', skills: ['SQL', 'Python', 'Tableau', 'Statistics'], posted: '2026-05-14', featured: false, description: 'Analyze user behavior data to drive product decisions and growth strategies.' },
    { id: 'j8', title: 'Mobile Developer (iOS)', companyId: 'c8', salary: '$125k - $160k', experience: '3+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Remote', skills: ['Swift', 'SwiftUI', 'UIKit', 'REST APIs'], posted: '2026-05-13', featured: false, description: 'Build delightful mobile experiences for travelers around the world.' },
    { id: 'j9', title: 'Full Stack Developer', companyId: 'c1', salary: '$130k - $165k', experience: '4+ years', location: 'Bangalore, India', type: 'Full-time', remote: 'Hybrid', skills: ['JavaScript', 'Python', 'React', 'GCP'], posted: '2026-05-12', featured: false, description: 'Work on full-stack features for Google Cloud products.' },
    { id: 'j10', title: 'Security Engineer', companyId: 'c2', salary: '$155k - $195k', experience: '6+ years', location: 'Redmond, WA', type: 'Full-time', remote: 'Onsite', skills: ['Security', 'Penetration Testing', 'SIEM', 'Cloud Security'], posted: '2026-05-11', featured: false, description: 'Protect Microsoft products and services from security threats.' },
    { id: 'j11', title: 'Marketing Manager', companyId: 'c3', salary: '$100k - $130k', experience: '5+ years', location: 'Seattle, WA', type: 'Full-time', remote: 'Hybrid', skills: ['Digital Marketing', 'SEO', 'Analytics', 'Campaign Management'], posted: '2026-05-10', featured: false, description: 'Lead marketing campaigns for Amazon Web Services products.' },
    { id: 'j12', title: 'QA Engineer', companyId: 'c4', salary: '$95k - $125k', experience: '3+ years', location: 'Austin, TX', type: 'Full-time', remote: 'Remote', skills: ['Selenium', 'Jest', 'API Testing', 'Automation'], posted: '2026-05-09', featured: false, description: 'Ensure quality of Meta\'s products through automated and manual testing.' },
    { id: 'j13', title: 'Content Strategist', companyId: 'c5', salary: '$85k - $110k', experience: '3+ years', location: 'Los Angeles, CA', type: 'Full-time', remote: 'Remote', skills: ['Content Writing', 'SEO', 'Social Media', 'Analytics'], posted: '2026-05-08', featured: false, description: 'Develop content strategies for Netflix original programming.' },
    { id: 'j14', title: 'Intern - Software Engineering', companyId: 'c6', salary: '$45/hr', experience: '0-1 years', location: 'San Francisco, CA', type: 'Internship', remote: 'Onsite', skills: ['JavaScript', 'Python', 'Git'], posted: '2026-05-07', featured: true, description: 'Summer internship program for aspiring software engineers.' },
    { id: 'j15', title: 'Technical Program Manager', companyId: 'c7', salary: '$140k - $175k', experience: '6+ years', location: 'Stockholm, Sweden', type: 'Full-time', remote: 'Hybrid', skills: ['Agile', 'Project Management', 'Communication', 'Technical Background'], posted: '2026-05-06', featured: false, description: 'Drive cross-functional technical programs for Spotify platform teams.' },
    { id: 'j16', title: 'UX Researcher', companyId: 'c8', salary: '$110k - $140k', experience: '4+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid', skills: ['User Research', 'Usability Testing', 'Surveys', 'Analytics'], posted: '2026-05-05', featured: false, description: 'Conduct research to inform product decisions for Airbnb experiences.' },
    { id: 'j17', title: 'Site Reliability Engineer', companyId: 'c1', salary: '$150k - $185k', experience: '5+ years', location: 'Zurich, Switzerland', type: 'Full-time', remote: 'Onsite', skills: ['Go', 'Linux', 'Monitoring', 'Distributed Systems'], posted: '2026-05-04', featured: false, description: 'Ensure reliability and performance of Google\'s critical services.' },
    { id: 'j18', title: 'Business Analyst', companyId: 'c2', salary: '$95k - $120k', experience: '3+ years', location: 'London, UK', type: 'Full-time', remote: 'Hybrid', skills: ['Excel', 'Power BI', 'SQL', 'Business Analysis'], posted: '2026-05-03', featured: false, description: 'Analyze business metrics and provide insights for Microsoft 365.' },
    { id: 'j19', title: 'Graphic Designer', companyId: 'c3', salary: '$70k - $95k', experience: '2+ years', location: 'Remote', type: 'Contract', remote: 'Remote', skills: ['Adobe Creative Suite', 'Branding', 'Illustration'], posted: '2026-05-02', featured: false, description: 'Create visual assets for Amazon marketing campaigns.' },
    { id: 'j20', title: 'AI/ML Research Scientist', companyId: 'c4', salary: '$180k - $250k', experience: 'PhD + 2 years', location: 'Menlo Park, CA', type: 'Full-time', remote: 'Hybrid', skills: ['Deep Learning', 'NLP', 'Computer Vision', 'Research'], posted: '2026-05-01', featured: true, description: 'Push the boundaries of AI research at Meta AI Research lab.' },
    { id: 'j21', title: 'iOS Engineer', companyId: 'c9', salary: '$135k - $175k', experience: '4+ years', location: 'Cupertino, CA', type: 'Full-time', remote: 'Onsite', skills: ['Swift', 'Objective-C', 'UIKit', 'Core Data'], posted: '2026-04-30', featured: true, description: 'Build features for Apple\'s flagship products used by millions daily.' },
    { id: 'j22', title: 'Battery Systems Engineer', companyId: 'c10', salary: '$120k - $155k', experience: '3+ years', location: 'Austin, TX', type: 'Full-time', remote: 'Onsite', skills: ['Electrochemistry', 'MATLAB', 'Python', 'CAD'], posted: '2026-04-29', featured: false, description: 'Advance energy storage technology for next-generation electric vehicles.' },
    { id: 'j23', title: 'Creative Cloud Product Manager', companyId: 'c11', salary: '$130k - $165k', experience: '5+ years', location: 'San Jose, CA', type: 'Full-time', remote: 'Hybrid', skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Analytics'], posted: '2026-04-28', featured: false, description: 'Define product vision for creative tools used by designers worldwide.' },
    { id: 'j24', title: 'Salesforce Developer', companyId: 'c12', salary: '$110k - $140k', experience: '3+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Remote', skills: ['Apex', 'Lightning', 'SOQL', 'Integration'], posted: '2026-04-27', featured: false, description: 'Customize and extend Salesforce for enterprise clients.' },
    { id: 'j25', title: 'Quantum Computing Researcher', companyId: 'c13', salary: '$160k - $210k', experience: 'PhD required', location: 'Yorktown Heights, NY', type: 'Full-time', remote: 'Hybrid', skills: ['Quantum Algorithms', 'Qiskit', 'Physics', 'Python'], posted: '2026-04-26', featured: true, description: 'Research quantum algorithms at IBM Research.' },
    { id: 'j26', title: 'Management Consultant', companyId: 'c14', salary: '$95k - $130k', experience: '2+ years', location: 'Chicago, IL', type: 'Full-time', remote: 'Hybrid', skills: ['Strategy', 'PowerPoint', 'Financial Modeling', 'Client Management'], posted: '2026-04-25', featured: false, description: 'Solve complex business problems for Fortune 500 clients.' },
    { id: 'j27', title: 'Maps Software Engineer', companyId: 'c15', salary: '$140k - $180k', experience: '4+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid', skills: ['C++', 'Geo APIs', 'Distributed Systems', 'Go'], posted: '2026-04-24', featured: false, description: 'Improve routing and location services for Uber\'s global platform.' },
    { id: 'j28', title: 'Shopify App Developer', companyId: 'c16', salary: '$100k - $135k', experience: '3+ years', location: 'Remote', type: 'Full-time', remote: 'Remote', skills: ['React', 'Node.js', 'GraphQL', 'Shopify API'], posted: '2026-04-23', featured: false, description: 'Build apps that extend Shopify\'s commerce ecosystem for merchants.' },
    { id: 'j29', title: 'HR Business Partner', companyId: 'c12', salary: '$90k - $115k', experience: '5+ years', location: 'New York, NY', type: 'Full-time', remote: 'Hybrid', skills: ['HR Strategy', 'Employee Relations', 'Compliance', 'Coaching'], posted: '2026-04-22', featured: false, description: 'Partner with leadership to drive people strategy and culture.' },
    { id: 'j30', title: 'Cybersecurity Analyst', companyId: 'c13', salary: '$105k - $135k', experience: '3+ years', location: 'Armonk, NY', type: 'Full-time', remote: 'Remote', skills: ['SIEM', 'Incident Response', 'Threat Intel', 'SOC'], posted: '2026-04-21', featured: false, description: 'Monitor and respond to security threats across enterprise environments.' },
    { id: 'j31', title: 'Supply Chain Manager', companyId: 'c3', salary: '$115k - $145k', experience: '6+ years', location: 'Seattle, WA', type: 'Full-time', remote: 'Onsite', skills: ['Logistics', 'SAP', 'Forecasting', 'Lean'], posted: '2026-04-20', featured: false, description: 'Optimize global supply chain operations for Amazon fulfillment.' },
    { id: 'j32', title: 'Clinical Data Manager', companyId: 'c14', salary: '$85k - $110k', experience: '4+ years', location: 'Boston, MA', type: 'Full-time', remote: 'Hybrid', skills: ['CDISC', 'EDC', 'GCP', 'SAS'], posted: '2026-04-19', featured: false, description: 'Manage clinical trial data for healthcare consulting engagements.' },
    { id: 'j33', title: 'Android Developer', companyId: 'c9', salary: '$128k - $162k', experience: '3+ years', location: 'Cupertino, CA', type: 'Full-time', remote: 'Hybrid', skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Gradle'], posted: '2026-04-18', featured: false, description: 'Develop Android applications and frameworks for Apple ecosystem partners.' },
    { id: 'j34', title: 'Autopilot Software Intern', companyId: 'c10', salary: '$55/hr', experience: '0-1 years', location: 'Palo Alto, CA', type: 'Internship', remote: 'Onsite', skills: ['C++', 'Python', 'Computer Vision', 'ROS'], posted: '2026-04-17', featured: true, description: 'Contribute to self-driving software stack during summer internship.' },
    { id: 'j35', title: 'Brand Designer', companyId: 'c11', salary: '$88k - $115k', experience: '3+ years', location: 'Remote', type: 'Full-time', remote: 'Remote', skills: ['Illustrator', 'Photoshop', 'Brand Guidelines', 'Typography'], posted: '2026-04-16', featured: false, description: 'Shape visual identity across Adobe\'s product marketing campaigns.' },
    { id: 'j36', title: 'Customer Success Manager', companyId: 'c16', salary: '$75k - $100k', experience: '2+ years', location: 'Toronto, Canada', type: 'Full-time', remote: 'Remote', skills: ['SaaS', 'Onboarding', 'Retention', 'CRM'], posted: '2026-04-15', featured: false, description: 'Help merchants succeed on Shopify with proactive support and strategy.' },
    { id: 'j37', title: 'Legal Counsel - Tech', companyId: 'c4', salary: '$170k - $220k', experience: '7+ years', location: 'Menlo Park, CA', type: 'Full-time', remote: 'Hybrid', skills: ['IP Law', 'Privacy', 'Contracts', 'Compliance'], posted: '2026-04-14', featured: false, description: 'Advise product teams on regulatory and intellectual property matters.' },
    { id: 'j38', title: 'Growth Marketing Lead', companyId: 'c15', salary: '$125k - $160k', experience: '5+ years', location: 'San Francisco, CA', type: 'Full-time', remote: 'Hybrid', skills: ['Performance Marketing', 'A/B Testing', 'SQL', 'Attribution'], posted: '2026-04-13', featured: true, description: 'Drive user acquisition and retention for Uber Eats in key markets.' },
    { id: 'j39', title: 'Nurse Practitioner', companyId: 'c14', salary: '$95k - $125k', experience: '4+ years', location: 'Houston, TX', type: 'Full-time', remote: 'Onsite', skills: ['Patient Care', 'EMR', 'Clinical Assessment', 'Telehealth'], posted: '2026-04-12', featured: false, description: 'Deliver primary care services through Deloitte\'s health practice partnerships.' },
    { id: 'j40', title: 'Technical Writer', companyId: 'c6', salary: '$80k - $105k', experience: '3+ years', location: 'Remote', type: 'Full-time', remote: 'Remote', skills: ['Documentation', 'API Docs', 'Markdown', 'Developer Tools'], posted: '2026-04-11', featured: false, description: 'Create clear developer documentation for Stripe\'s payment APIs.' }
  ],

  testimonials: [
    { id: 1, text: 'Niks Jobs helped me land my dream role at a FAANG company within 3 weeks. The platform is incredibly intuitive!', author: 'Sarah Chen', role: 'Software Engineer at Google', avatar: 'SC' },
    { id: 2, text: 'As a recruiter, this is the best job portal I\'ve used. Quality candidates and powerful filtering tools.', author: 'Michael Rodriguez', role: 'HR Director at Stripe', avatar: 'MR' },
    { id: 3, text: 'The application tracking and notifications kept me organized throughout my job search journey.', author: 'Priya Sharma', role: 'Product Manager at Spotify', avatar: 'PS' },
    { id: 4, text: 'I found a remote role that matched my skills perfectly. The salary filters and company reviews saved me hours.', author: 'Daniel Okonkwo', role: 'DevOps Lead at Netflix', avatar: 'DO' },
    { id: 5, text: 'Switched careers from finance to product design thanks to the curated listings and career resources on Niks Jobs.', author: 'Elena Vasquez', role: 'Product Designer at Adobe', avatar: 'EV' },
    { id: 6, text: 'Our startup filled three engineering roles in under a month. Applicant quality was outstanding.', author: 'Ryan Mitchell', role: 'CTO at TechVentures', avatar: 'RM' },
    { id: 7, text: 'The interview scheduler and real-time alerts made coordinating with recruiters effortless.', author: 'Aisha Patel', role: 'Data Scientist at Amazon', avatar: 'AP' },
    { id: 8, text: 'Best job board for international opportunities. I relocated from India to Germany through a role I found here.', author: 'Vikram Singh', role: 'Cloud Architect at SAP', avatar: 'VS' }
  ],

  notifications: [
    { id: 'n1', type: 'alert', title: 'New jobs matching your profile', message: '18 new Frontend Developer positions posted today', time: '5 min ago', unread: true },
    { id: 'n2', type: 'application', title: 'Application viewed', message: 'Google viewed your application for Senior Frontend Developer', time: '1 hour ago', unread: true },
    { id: 'n3', type: 'interview', title: 'Interview scheduled', message: 'Microsoft - Cloud Solutions Architect on May 28, 2026 at 2:00 PM', time: '3 hours ago', unread: true },
    { id: 'n4', type: 'message', title: 'New message from recruiter', message: 'Hi! We\'d love to discuss the ML Engineer role with you.', time: 'Yesterday', unread: false },
    { id: 'n5', type: 'application', title: 'Application submitted', message: 'Your application to Stripe has been received', time: '2 days ago', unread: false },
    { id: 'n6', type: 'alert', title: 'Salary insights updated', message: 'New market data for Senior Engineers in San Francisco', time: '3 days ago', unread: false },
    { id: 'n7', type: 'interview', title: 'Interview reminder', message: 'Amazon interview tomorrow at 10:00 AM — prepare your portfolio', time: '4 days ago', unread: false },
    { id: 'n8', type: 'application', title: 'Application status changed', message: 'Meta moved your application to final round', time: '5 days ago', unread: false },
    { id: 'n9', type: 'message', title: 'Recruiter follow-up', message: 'Can you share availability for a technical screen this week?', time: '6 days ago', unread: false },
    { id: 'n10', type: 'alert', title: 'Profile strength tip', message: 'Add 2 more skills to reach 90% profile completion', time: '1 week ago', unread: false }
  ],

  userProfile: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    avatar: 'AJ',
    bio: 'Passionate frontend developer with 6+ years of experience building scalable web applications. Focused on performance, accessibility, and delightful user experiences.',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'GraphQL', 'Next.js', 'Tailwind CSS', 'Jest', 'Webpack', 'Figma', 'Agile', 'System Design'],
    education: [
      { school: 'Stanford University', degree: 'B.S. Computer Science', years: '2014 - 2018' },
      { school: 'MIT', degree: 'M.S. Computer Science', years: '2018 - 2020' },
      { school: 'freeCodeCamp', degree: 'Full Stack Certification', years: '2017' }
    ],
    experience: [
      { company: 'TechCorp Inc.', role: 'Senior Frontend Developer', years: '2021 - Present', description: 'Led frontend architecture for enterprise SaaS platform serving 50k+ users. Reduced load time by 40%.' },
      { company: 'StartupXYZ', role: 'Frontend Developer', years: '2018 - 2021', description: 'Built responsive web apps using React and Redux. Shipped 12 major features from MVP to Series B.' },
      { company: 'Digital Agency Co.', role: 'Junior Web Developer', years: '2016 - 2018', description: 'Developed client websites and marketing landing pages for Fortune 500 brands.' }
    ],
    portfolio: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Portfolio', url: 'https://portfolio.dev' }
    ],
    completion: 78
  },

  applicants: [
    { id: 'a1', name: 'Emma Wilson', role: 'Frontend Developer', applied: '2026-05-22', status: 'reviewing', avatar: 'EW' },
    { id: 'a2', name: 'James Park', role: 'Full Stack Developer', applied: '2026-05-21', status: 'interview', avatar: 'JP' },
    { id: 'a3', name: 'Lisa Anderson', role: 'UI Designer', applied: '2026-05-20', status: 'new', avatar: 'LA' },
    { id: 'a4', name: 'David Kim', role: 'React Developer', applied: '2026-05-19', status: 'rejected', avatar: 'DK' },
    { id: 'a5', name: 'Maria Garcia', role: 'Senior Engineer', applied: '2026-05-18', status: 'offered', avatar: 'MG' },
    { id: 'a6', name: 'Thomas Wright', role: 'Backend Engineer', applied: '2026-05-17', status: 'reviewing', avatar: 'TW' },
    { id: 'a7', name: 'Nina Kapoor', role: 'Product Manager', applied: '2026-05-16', status: 'interview', avatar: 'NK' },
    { id: 'a8', name: 'Chris Martinez', role: 'DevOps Engineer', applied: '2026-05-15', status: 'new', avatar: 'CM' },
    { id: 'a9', name: 'Olivia Brown', role: 'Data Analyst', applied: '2026-05-14', status: 'reviewing', avatar: 'OB' },
    { id: 'a10', name: 'Kevin Nguyen', role: 'ML Engineer', applied: '2026-05-13', status: 'offered', avatar: 'KN' },
    { id: 'a11', name: 'Sophie Laurent', role: 'UX Designer', applied: '2026-05-12', status: 'interview', avatar: 'SL' },
    { id: 'a12', name: 'Ahmed Hassan', role: 'Security Engineer', applied: '2026-05-11', status: 'new', avatar: 'AH' }
  ],

  defaultApplications: [
    { jobTitle: 'Senior Frontend Developer', company: 'Google', status: 'interview', date: '2026-05-20' },
    { jobTitle: 'Full Stack Developer', company: 'Stripe', status: 'reviewing', date: '2026-05-18' },
    { jobTitle: 'Product Designer', company: 'Meta', status: 'submitted', date: '2026-05-15' },
    { jobTitle: 'Cloud Solutions Architect', company: 'Microsoft', status: 'interview', date: '2026-05-12' },
    { jobTitle: 'Machine Learning Engineer', company: 'Amazon', status: 'reviewing', date: '2026-05-10' },
    { jobTitle: 'iOS Engineer', company: 'Apple', status: 'submitted', date: '2026-05-08' },
    { jobTitle: 'Backend Engineer', company: 'Shopify', status: 'rejected', date: '2026-05-05' },
    { jobTitle: 'Growth Marketing Lead', company: 'Uber', status: 'offered', date: '2026-05-02' }
  ]
};

function getCompany(companyId) {
  return NiksJobsData.companies.find(c => c.id === companyId) || { name: 'Unknown', logo: '?', color: '#64748B' };
}

function getJobWithCompany(job) {
  const company = getCompany(job.companyId);
  return { ...job, company };
}

function getAllJobsEnriched() {
  return NiksJobsData.jobs.map(getJobWithCompany);
}
