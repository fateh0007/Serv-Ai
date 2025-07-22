सर्व.AI
Overview

सर्व.AI (ServAI) is an all-in-one AI workspace that seamlessly integrates a variety of powerful AI tools under one platform. Designed for modern productivity, it enables users to process images, generate and analyze text, review resumes, and more—all in a responsive, user-friendly environment.
Features

    Unified AI Suite: Access image processing, text generation, resume review, and other AI utilities from a single dashboard.

    Image AI Tools: Remove image backgrounds, erase objects, and enhance visuals using Cloudinary and advanced endpoints.

    Document AI: Upload and analyze resumes or PDFs for instant feedback and insights.

    User Management: Secure authentication, profile editing, personalized dashboards, and access control (premium & standard users).

    Modern UI: Smooth navigation, responsive design, and real-time updates.

    Role-Based Access: Distinct features for premium and regular users.

    Secure & Scalable: Robust backend with PostgreSQL, Express.js, and AWS integrations.

Demo
<!-- Add a demo video link here if available. Example: -->
Video Demonstration
<!-- <a href="YOUR_VIDEO_LINK"> <img src="YOUR_VIDEO_THUMBNAIL" width="500"/> </a> -->

Demo video coming soon!
Preview
<!-- Replace these with actual links or screenshots from your ServAI deployment --> <img src="https://github.com/Omsh24/ServAI/assets/preview1.png" width="900" alt="ServAI Dashboard preview"/> <img src="https://github.com/Omsh24/ServAI/assets/preview2.png" width="900" alt="Image AI preview"/> <img src="https://github.com/Omsh24/ServAI/assets/preview3.png" width="900" alt="Resume review preview"/>
Technologies Used

    Frontend: React.js, Vite, TailwindCSS, React Router

    Backend: Node.js, Express.js, Prisma

    Database: PostgreSQL

    Cloud/AI: Cloudinary, AWS, OpenAI

    Authentication: Clerk.dev, JWT

    APIs: RESTful API

Installation & Setup
Prerequisites

    Node.js (v18+)

    PostgreSQL

    Cloudinary & Clerk accounts for API keys

    npm

1. Clone the repository

bash
git clone https://github.com/Omsh24/ServAI.git
cd ServAI

2. Install dependencies

    Backend:

bash
npm install

Frontend:

    bash
    cd client
    npm install
    cd ..

3. Configuration

    Create a .env file in the root directory

    Add your PostgreSQL URI, Clerk and Cloudinary API keys, and other required environment variables

Sample .env variables:

text
DATABASE_URL=
CLERK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENAI_API_KEY=
PORT=3000
...

4. Run migrations

bash
npx prisma migrate dev

5. Run the project

    Backend:

bash
npm run dev

Frontend:

    bash
    cd client
    npm run dev

Contributing

If you'd like to contribute to this project, feel free to fork the repository, create a feature branch, and submit a pull request.
Contact

    Om Shukla: omshukla2403@gmail.com

Empower your productivity with all your favorite AI tools — unified in one modern workspace: सर्व.AI!
