# Staff Management App

This application provides functionalities for managing staff information, including adding, editing, deleting, and searching for staff records. The app is built using React.js for the frontend and ASP.NET Core Web API for the backend. It includes unit tests, integration tests, and end-to-end tests to ensure its reliability and functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Requirements](#requirements)

## Installation

To run the application locally, follow these steps:

1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com/your-username/staff-management-app.git
2. Navigate to the frontend directory:
   cd staff-management-app/frontend
3. Install dependencies:
   npm install
4. Start the frontend server:
   npm start
5. Open another terminal window and navigate to the backend directory:
   cd ../backend
6. Build and run the backend server:
   dotnet run

## Usage

The application allows users to add, edit, and delete staff records.
Users can search for staff records using various criteria, including Staff ID, Gender, and Birthday.
After performing a search, users can export the search results to Excel or PDF format.

## Testing

The application is tested using the following methods:

Unit Tests: Ensure that individual components and functions work correctly.
Integration Tests: Verify the interactions between different modules or layers.
End-to-End Tests: Validate the entire application workflow from user interactions to database operations.

## Requirements

Backend: The backend is implemented in ASP.NET Core Web API using C#.
Frontend:The frontend is implemented in React.Js.
