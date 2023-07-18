import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import './CustomTable.css';

const Regression = () => {
  const [data, setData] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getProjectsRegressionData");
        const result = response.data;
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    const readFileContent = async () => {
      try {
        const response = await fetch("/teams.txt");
        const content = await response.text();
        setFileContent(content);
      } catch (error) {
        console.log("Error reading file:", error);
      }
    };
    readFileContent();
  }, []);

  const calculateAge = (dateString) => {
    const startDate = new Date(dateString.substring(0, 10));
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let businessDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  };

  const formatDate = (dateString) => {
    const formattedDate = dateString.split('T')[0];
    return formattedDate;
  };

  const calculateActualAge = (dateString) => {
    const startDate = new Date(dateString.substring(0, 10));
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffInDays = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
    return diffInDays;
  };

  const fixed = (ver) => {
    if (ver && ver.length > 0) {
      return ver[0].name;
    } else {
      return '';
    }
  };

  if (isLoading) {
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `;

    return (
      <div className="container d-flex align-items-center justify-content-center">
        <div className="spinner-container">
          <ClipLoader color={"#123abc"} loading={isLoading} css={override} size={50} />
        </div>
      </div>
    );
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const filteredData = data.issues.map((issue) => {
    const modifiedLabels = issue.fields.labels.filter((label) =>
      fileContent.toLowerCase().includes(label.toLowerCase())
    );
    if (modifiedLabels.length === 0) {
      return {
        ...issue,
      };
    }
    return {
      ...issue,
      fields: {
        ...issue.fields,
        labels: modifiedLabels,
      },
    };
  });

  const doneData = filteredData.filter((issue) => issue.fields.status.name === "Done");
  const closedData = filteredData.filter((issue) => issue.fields.status.name === "Closed");
  const otherData = filteredData.filter((issue) => issue.fields.status.name !== "Done" && issue.fields.status.name !== "Closed");

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div>
        <h1 style={{ textAlign: 'center' }}>Regression</h1>
        {otherData.length > 0 && (
          <div>
            <h2>Open Issues</h2>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Priority</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>Fix Versions</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
                {otherData.map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>{(issue.fields.customfield_16500 != null) ? issue.fields.customfield_16500.value : issue.fields.priority.name}</td>
                    <td style={{ textAlign: 'left' }} >{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{fixed(issue.fields.fixVersions)}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {doneData.length > 0 && (
          <div>
            <h2>Done Issues</h2>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Priority</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>Fix Versions</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
                {doneData.map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>{(issue.fields.customfield_16500 != null) ? issue.fields.customfield_16500.value : issue.fields.priority.name}</td>
                    <td style={{ textAlign: 'left' }} >{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{fixed(issue.fields.fixVersions)}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {closedData.length > 0 && (
          <div>
            <h2>Closed Issues</h2>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Priority</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>Fix Versions</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
                {closedData.map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'center' }}>{(issue.fields.customfield_16500 != null) ? issue.fields.customfield_16500.value : issue.fields.priority.name}</td>
                    <td style={{ textAlign: 'left' }} >{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{fixed(issue.fields.fixVersions)}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Regression;
