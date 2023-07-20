# Dynamic KPI Report 1

The application displays the live data for Customer issues, Internal Defects and Security Issues and sorts them in tables according to priority of the issues. Along with these 3, CIRS and Customer Regression are also displayed.

## Table of Contents

- [Project Description](#project-description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#technologies-used)
- [Authors](#technologies-used)


## Project Description

The backend of the application fetches the live data for each of the issue types. The application uses jira apis to do so. Henceforth, the frontend takes the data from the backend api and displays it on the client side.

## Installation

To setup the project locally follow these steps on terminal :

## Run Locally

Clone the project

```bash
  git clone https://github.wdf.sap.corp/Ariba-Ond/DynamicKPIReport.git
```

Go to the project directory

```bash
  cd DynamicKPIReport
```

Install dependencies and start the server

```bash
  cd backend
  npm install
  nodemon start
  cd ..
  cd frontend
  npm install
  npm start
```
The server will run on http://localhost:3000/
 
## Usage

The application displays issues sorted on the basis of priority and anyone can check the total count and in some cases the mean backlog age of those issues. The application allows the user to set the mean backlog age goals bar. According to this bar the issues are highlighted if they surpass the specified bar. So one can have a pretty concise view of the type of issues they want to track. The application also allows itself to be copied to be attached on emails.

## Features
 
The key features are :
- Live data 
- User friendly UI with toggle option
- Red color highlight for the concered issues 
- Detailed info about an issue

## Technologies Used

**Client:** React, 

**Server:** Node, Express


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`TOKEN`


## Authors

- [@Arunangshu Roy](https://github.wdf.sap.corp/I588020)
- [@Shreya Botte](https://github.wdf.sap.corp/I588173)


![Logo](http://ftibelman.com/wp-content/uploads/2019/02/sap-ariba-logo_1_11_16.png)




