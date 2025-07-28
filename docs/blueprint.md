# **App Name**: RealGoal

## Core Features:

- Sidebar Integration: Adds a 'Goals' item to the sidebar menu using a target icon from lucide-react, linking to the '/dashboard/goals' page.
- Goal Dashboard: Displays a page at '/dashboard/goals' with a title, a 'Create New Goal' button, and a list of goal cards showing the goal name, progress bar, saved vs. total amount, deadline, and options to edit or delete.
- Goal Form: Opens a modal dialog for creating or editing goals with fields for goal name, total amount, optional initial amount, and a date selector for the deadline. The save button is disabled until required fields are filled.
- Goal Creation: Saves new goal data, including goal name, total amount, initial amount, and deadline, in local storage. Local storage is used for persisting data due to no database implementation requested by the user.
- Progress Tracking: Adds functionality to 'add money' to a goal, creating an automatic expense transaction in local storage with category 'Investments/Goals' and a description like 'Added to goal: [Goal Name]'. The progress bar gets automatically updated with this value. Local storage is used for persisting data due to no database implementation requested by the user.
- Goal Deletion: Upon deleting a goal from local storage, the existing expense transactions are not deleted.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6), symbolizing trust and financial stability.
- Background color: Light grey (#F5F5F5), offering a clean and modern backdrop.
- Accent color: Subtle teal (#4DB6AC), used for interactive elements, suggesting growth and progress.
- Body and headline font: 'PT Sans' (sans-serif) provides a clean and modern look for both headings and body text. 
- Utilize clean, geometric icons from lucide-react to represent goals, progress, and other actions within the app. These icons maintain a consistent visual language and enhance usability.
- The layout should focus on a clean and user-friendly interface with well-organized cards for goals, intuitive form designs, and clear navigation.
- Use subtle animations to provide feedback and enhance the user experience, such as progress bar transitions.