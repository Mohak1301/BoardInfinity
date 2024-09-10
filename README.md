

 #### Notion Document :  https://light-verdict-bc5.notion.site/Mohak_Tiwari-Admin-panel-8a6be621f8954db598c1577337ca468c?pvs=4
      
 #### Deployment Link :  [boardinfinity.onrender.com](https://boardinfinity.onrender.com/)
      
 #### Postman Collection : https://documenter.getpostman.com/view/32409656/2sAXjSyTzP
# Admin Panel API

This project is a backend API built with Node.js, Express, and PostgreSQL, designed to support an Admin Panel with user management, role-based access control, and project management features. The API allows Admins to create and assign users, manage projects, and keep track of important actions via audit logs.

## Objective

The goal of this project is to implement a backend system where:

 &#8226; Admins can manage users and projects.

 &#8226; Managers can assign employees to projects.

 &#8226; Employees can view their assigned projects.

  The API implements authentication and authorization, ensuring that users have appropriate access based on their roles.

## Task Requirements

 #### User Authentication 
 
 &#8226; User login, signup, and JWT token-based authentication.

#### User Role Management

 &#8226; Admins can create users and assign them roles (Admin, Manager, or Employee).

#### Project Management 

 &#8226; Admins can create, update, and soft delete projects.
 
 &#8226; Managers can assign employees to the projects assigned to them.

#### Audit Logs 

 &#8226; Records key actions such as creating, updating, or deleting resources.

#### Validation with Joi

 &#8226; Joi is used for data validation to ensure that all inputs are correctly formatted and meet the application's requirements

 &#8226; User Schema Validation: Ensures all user data (such as username, email, password, and role) is valid and conforms to the expected formats   
 
  and constraints.

 &#8226; Project Schema Validation: Ensures all project-related data is valid and prevents incomplete or incorrect data entry.

 &#8226; Role Validation: Ensures that only predefined roles ('Admin', 'Manager', 'Employee') are assigned to users.







