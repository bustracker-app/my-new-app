# **App Name**: Abu Huraira Institute School App

## Core Features:

- Role-Based Authentication: Secure Firebase Authentication with role-based access control for admins, teachers, students, parents, and drivers, utilizing Firestore to store user roles and protect routes.
- Student Management: Comprehensive student management features including adding, editing, and deleting student profiles, assigning classes and sections, linking parents, and uploading relevant documents, stored securely in Firestore.
- Homework Assignment and Submission: A streamlined homework system enabling teachers to upload assignments with due dates and attachments, while students can submit their work digitally, with Firestore managing the data.
- Live Bus Tracking with ETA Prediction: Real-time bus tracking using Firebase Realtime Database for GPS data, allowing parents to view the bus location on a live map and estimate arrival times using a tool that incorporates current location, speed, and route information.
- Push Notifications: Firebase Cloud Messaging (FCM) to send notifications for homework assignments, fee dues, student absences, bus arrival alerts, and important announcements from the admin.
- Marks and Attendance System: An integrated system for entering subject-wise marks, auto-calculating grades, and generating report cards in PDF format, coupled with a daily attendance system that produces monthly reports and calculates attendance percentages.
- Fees Management: Robust fee management functionality to handle class-wise fee structures, track transport fees, manage payments, and generate printable receipts, all stored securely within Firestore.

## Style Guidelines:

- Admin Theme: Dark Blue (#192A56) to convey professionalism and authority. Inspired by classic educational institutions. Provides a sense of structure and reliability in the app.
- Background: Light gray (#F0F4F8), a desaturated form of the admin theme's hue, for a clean and unobtrusive backdrop.
- Accent: Orange (#E67E22), an analogous color to the admin theme that is high in saturation and contrast to draw attention to important calls to action.
- Body: 'Inter' sans-serif font for clear readability in all sections of the app. Headline: 'Space Grotesk', to distinguish headers from other text, and complement 'Inter'.
- Code Font: 'Source Code Pro' for any code snippets displayed.
- Consistent use of simple, modern icons throughout the app to aid navigation and enhance the user experience.
- Responsive design with a sidebar navigation for easy access to different modules, ensuring optimal viewing across devices.