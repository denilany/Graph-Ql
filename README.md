# GraphQL Profile Page Project Documentation

## Overview

This project involves creating a personalized profile page that displays your school information by querying data from a GraphQL endpoint. The project requires implementing a login system, fetching user data, and visualizing statistics using SVG graphs.

## Project Requirements

### Core Objectives
1. **GraphQL Implementation**: Use GraphQL to query user data from the provided endpoint.
2. **Profile Page**: Display at least three pieces of user information (e.g., XP, audits, skills).
3. **Statistics Visualization**: Create at least two different SVG graphs to visualize user data.
4. **Login System**: Implement a secure login using JWT authentication.
5. **Hosting**: Deploy the profile page on a hosting service (e.g., vercel).

### Technical Details
- **GraphQL Endpoint**: `https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`
- **Authentication**: JWT obtained from `https://learn.zone01kisumu.ke/api/auth/signin` using Basic Auth.
- **UI/UX**: Follow good design principles, ensuring the interface is intuitive and responsive.

## Implementation Guide

### 1. Login System
- **Authentication Flow**:
  1. User enters credentials (username/email and password).
  2. Frontend sends a POST request to the signin endpoint with Basic Auth headers.
  3. On success, the backend returns a JWT.
  4. The JWT is stored (e.g., in localStorage) and used for subsequent GraphQL queries.

- **Error Handling**: Display clear messages for invalid credentials or network errors.
- **Logout**: Provide a button to clear the JWT and reset the session.

### 2. GraphQL Queries
- **Query Types**:
  - **Basic Query**: Fetch user details (e.g., `id`, `login`).
  - **Nested Query**: Retrieve related data (e.g., XP transactions linked to the user).
  - **Argument-Based Query**: Filter data (e.g., XP earned in a specific time period).

- **Example Queries**:
  ```graphql
  # Basic User Query
  query GetUser {
    user {
      id
      login
    }
  }

  # Nested Query (XP Transactions)
  query GetXP {
    transaction(where: { userId: { _eq: 1 } }) {
      amount
      createdAt
      user {
        login
      }
    }
  }

  # Argument-Based Query (Filter by Date)
  query GetRecentXP($startDate: timestamptz!) {
    transaction(where: { createdAt: { _gte: $startDate } }) {
      amount
      createdAt
    }
  }
  ```

### 3. Profile Page
- **Sections**:
  1. **User Info**: Display basic details (name, login, email).
  2. **XP Summary**: Show total XP and recent earnings.
  3. **Progress**: List completed projects or exercises.
  4. **Statistics Graphs**: Visualize data trends (see below).

### 4. SVG Graphs
- **Graph Types**:
  - **Line Graph**: Track XP over time.
  - **Bar Chart**: Compare XP by project.
  - **Pie Chart**: Show pass/fail ratios.

- **Implementation**:
  - Use SVG elements (`<svg>`, `<path>`, `<rect>`) to draw graphs.
  - Add interactivity (e.g., hover effects) using JavaScript.

### 5. Hosting
- **Options**:
  - **Vercel**: Fast deployment with modern tooling.

## Example Code Snippets

### Login (JavaScript)
```javascript
async function login(username, password) {
  const token = btoa(`${username}:${password}`);
  const response = await fetch('https://learn.zone01kisumu.ke/api/auth/signin', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${token}` },
  });
  if (!response.ok) throw new Error('Login failed');
  const jwt = await response.text();
  localStorage.setItem('jwt', jwt);
  return jwt;
}
```

### GraphQL Query (JavaScript)
```javascript
async function fetchUserData(jwt) {
  const query = `
    query GetUserData {
      user {
        id
        login
        XP: transaction(where: { type: { _eq: "xp" } }) {
          amount
        }
      }
    }
  `;
  const response = await fetch('https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ query }),
  });
  return await response.json();
}
```

### SVG Line Graph (HTML)
```html
<svg width="400" height="200">
  <path d="M 0,200 L 100,150 L 200,100 L 300,50" stroke="blue" fill="none" />
  <text x="50" y="190">Jan</text>
  <text x="150" y="190">Feb</text>
  <text x="250" y="190">Mar</text>
</svg>
```

## Deliverables
1. **Source Code**: A Git repository with the project code.
2. **Hosted Profile**: A live URL where the profile is accessible.
3. **Documentation**: A README explaining how to set up and use the project.

## Evaluation Criteria
- **Functionality**: Login, data fetching, and graphs work as expected.
- **UI/UX**: The interface is user-friendly and visually appealing.
- **Code Quality**: Clean, modular, and well-documented code.
- **Creativity**: Unique design or additional features (e.g., animated graphs).

## Resources
- [GraphQL Documentation](https://graphql.org/learn/)
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [JWT Guide](https://jwt.io/introduction)