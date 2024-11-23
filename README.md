# JSON String Upload and Deserialization

This project implements a full-stack web application that allows users to upload or paste a JSON string, view the deserialized JSON in a tree structure, and submit it to a backend API for further processing. The application is built with **Next.js** and **React** for the frontend, and **Node.js** (with SQLite as database) for the backend.

## Features

-   **Paste JSON string**: Users can paste a JSON string directly into a textarea.
-   **Upload JSON file**: Users can upload a `.json` file. The file will be validated to ensure it does not exceed 100MB.
-   **Error handling**: Invalid JSON input or large file errors will trigger error messages.
-   **Deserialization**: After submission, the JSON is deserialized and displayed in a collapsible tree structure.
-   **Backend API**: The backend API handles deserialization and data insertion into a database (SQLite).
-   **Responsive design**: The UI is fully responsive and works on various screen sizes.
-   **Floating action button**: A floating button is included for navigation to another page (e.g., "Show All JSON").

## How to Run or Use the Project

### Prerequisites

-   **Node.js** (>= v18) and **npm** installed on your machine. You can install Node.js from [here](https://nodejs.org/).
-   **Next.js** (the app is built using Next.js, so it includes React and other required dependencies).
-   **Database**: The project uses SQLite database include in the repo.

### Steps to Run

1.  **Clone the repository**:

    `git clone https://github.com/ryzncodes/branchify.git`

2.  **Navigate into the project folder**:

    `cd project-folder`

3.  **Install dependencies**:
    `npm install`
4.  **Run the development server**:

    `npm run dev`

    By default, the app will be available at `http://localhost:3000`. Open this URL in your browser to use the application.

5.  **Optional: Build for production**: If you want to build the app for production use, run:

    `npm run build
npm start`

### Usage

-   You can either **paste a JSON string** directly into the provided textarea or **upload a `.json` file** using the "Upload JSON" button.
-   After submitting the form, the deserialized JSON data will be displayed in a collapsible tree structure.
-   The backend API accepts the JSON string, deserializes it, and stores it in the database.

## API Endpoints

### 1. POST `/api/deserialize`

This endpoint accepts a JSON string in the request body, validates and deserializes it, then stores it in the database.

**Request:**

-   Method: `POST`
-   URL: `/api/deserialize`
-   Body:

    `{
  "jsonString": "{ \"name\": \"John\", \"age\": 30 }"
}`

**Response:**

-   Success:

    `{
  "name": "John",
  "age": 30
}`

-   Error (Empty JSON string):

    `{
  "error": "JSON string cannot be empty."
}`

-   Error (Invalid JSON):

    `{
  "error": "Invalid JSON format"
}`

**Error Codes:**

-   `400`: Bad Request (Invalid or empty JSON string)
-   `413`: Payload Too Large (If JSON string exceeds 100MB)

### 2. GET `/api/show-all-json`

This endpoint retrieves all stored JSON records from the database and returns them as a parsed JSON response.

**Request:**

-   Method: `GET`
-   URL: `/api/show-all-json`

**Response:**

-   Success:

    `{
  "data": [
    {
      "data": {
        "name": "John",
        "age": 30
      }
    },
    {
      "data": {
        "city": "New York",
        "population": 8000000
      }
    }
  ],
  "message": "All JSON records fetched successfully"
}`

-   Error:

    `{
  "error": "Failed to fetch data from the database"
}`

**Error Codes:**

-   `500`: Internal Server Error (Database connection or fetching error)

## Testing

This project includes automated tests for both the frontend and backend. We use **Jest** for testing, and **Mock Requests** to simulate the API interaction.

### Running Tests

To run the tests, you will need to have **Jest** installed. If Jest is not yet installed, run the following command to install the necessary dependencies:

`npm install --save-dev jest @types/jest ts-jest`

Then, you can run the tests with:

`npm test`

---

### Test Example

Here is a sample test for the `POST /api/deserialize` endpoint, which verifies if the endpoint correctly handles valid and invalid JSON input:

    import { insertJson } from '@/db/database';
    import { POST } from '../../app/api/deserialize/route'; // Adjust the path if necessary

    jest.mock('@/db/database', () => ({
      insertJson: jest.fn(),
    }));

    // Create a mock request that satisfies the `Request` type
    class MockRequest extends Request {
      constructor(body: unknown) {
        // Calculate content length dynamically based on the body size
        const bodyString = JSON.stringify(body);
        const contentLength = Buffer.byteLength(bodyString, 'utf8'); // Correct content length
        super('http://localhost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': contentLength.toString() },
          body: bodyString,
        });
      }
    }

    describe('POST /api/deserialize', () => {
      it('should return a parsed JSON object for valid JSON string', async () => {
        const request = new MockRequest({ jsonString: '{"name": "John", "age": 30}' });

        const response = await POST(request);

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ name: 'John', age: 30 });
        expect(insertJson).toHaveBeenCalledWith('{"name": "John", "age": 30}');
      });

      it('should return an error if the JSON string is empty', async () => {
        const request = new MockRequest({ jsonString: '' });

        const response = await POST(request);

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('JSON string cannot be empty.');
      });

      it('should return an error if the JSON string is invalid', async () => {
        const request = new MockRequest({ jsonString: '{name: "John", age: 30}' }); // Invalid JSON

        const response = await POST(request);

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Invalid JSON format');
      });
    });

### Explanation

1.  **Mocking Database**: The `insertJson` function is mocked to prevent actual database calls and to verify that the function is being called with the correct JSON data.
2.  **MockRequest Class**: This class simulates a `Request` object to pass to the `POST` handler.
3.  **Test Cases**:
    -   The first test ensures that a valid JSON string is parsed correctly and stored.
    -   The second test checks for an empty JSON string.
    -   The third test ensures that invalid JSON is handled and the correct error message is returned.

## Assumptions Made

-   **JSON Format**: The JSON string or file uploaded must be valid JSON. If the user uploads an invalid JSON or an incorrectly formatted JSON string, an error message will be displayed.
-   **File Size Limit**: The uploaded JSON file cannot exceed **100MB**. Larger files will trigger an error message.
-   **Browser Compatibility**: The application assumes that users are using modern browsers (e.g., Chrome, Firefox, Safari) that support features like `FileReader`, ES6+ syntax, and React components.
-   **UI Responsiveness**: The app is designed to be mobile-friendly and should work on tablets and smartphones, but responsiveness has been primarily tested on larger screens.
-   The **backend functions** (`insertJson`, `getAllJson`) are correctly implemented and connected to the database.

## Additional Notes

-   **Collapsible JSON View**: The app uses a simple recursive approach to render the deserialized JSON in a collapsible format. Users can expand or collapse each section to navigate large JSON data efficiently.
-   **Next.js**: This app leverages the features of Next.js, such as routing and server-side rendering, for improved performance and scalability.
-   **Form Validation**: The form validates whether a JSON string or file is correctly provided and ensures that the file size does not exceed the limit.

## Future Improvements/TODO

-   **Support for Multiple Database Backends**:

    -   Implement functionality to switch between different database backends (e.g., MongoDB, Firebase, etc.), allowing greater flexibility.

-   **User Authentication and Authorization**:

    -   Implement user authentication (e.g., JWT, OAuth) and authorization for more secure access to the API and database.
    -   Allow users to store and manage their own JSON records.

-   **Pagination/Infinite Scrolling for JSON Data**:

    -   Implement pagination or infinite scrolling on the “Show All JSON” page to improve performance when displaying a large number of JSON records.

-   **UI/UX Improvements**:

    -   Enhance the frontend UI with better visual cues, like syntax highlighting for pasted JSON or a more interactive collapsible tree view.
    -   Add loading indicators for file uploads and data processing.

-   **JSON Import/Export**:

    -   Allow users to export their deserialized JSON objects to files or import them in different formats (e.g., CSV or Excel) for further processing.

-   **Rate Limiting for API Requests**:

    -   Implement rate-limiting on API endpoints to protect against abuse and ensure system stability.

-   **Performance Optimization**:

    -   Optimize the deserialization process, especially for large JSON strings, potentially introducing background processing for heavy computations.

-   **Automated Testing for Frontend**:

    -   Implement unit and integration tests for the frontend using tools like Jest and Cypress.

-   **Local Storage**:

    -   Implement local storage for users to temporarily save their JSON data without needing to upload it to the database immediately.

-   **Version Control for JSON Data**:

    -   Implement version control for stored JSON records, allowing users to see past versions and revert if necessary.

-   **CI/CD Pipeline Configuration**:

    -   Set up a Continuous Integration (CI) pipeline to automatically run tests on each pull request and commit to ensure code quality and functionality. This will include running unit tests, linting, and other quality checks.
    -   Implement a Continuous Deployment (CD) pipeline to automatically deploy the application to staging or production environments after successful tests, ensuring that new changes are quickly and safely released.
    -   Integrate additional workflows such as automatic dependency updates, security vulnerability scanning, and code coverage reports to further improve the development process.

-   **Error Reporting and Monitoring**:

    -   Integrate error reporting and monitoring tools (e.g., Sentry, LogRocket) to capture client-side and server-side errors and improve debugging.
