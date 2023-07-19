import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import './CustomTable.css';
import _ from 'lodash';


const Cirs = () => {
  const [data, setData] = useState([]);
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/cirs");
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
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
    if (!dateString) {
      return "";
    }

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
    if (!dateString) {
      return "";
    }

    const formattedDate = dateString.split("T")[0];
    return formattedDate;
  };

  const calculateActualAge = (dateString) => {
    if (!dateString) {
      return "";
    }

    const startDate = new Date(dateString.substring(0, 10));
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffInDays = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

    return diffInDays;
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

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  const filteredData = data.issues.map((issue) => {
    const modifiedLabels = issue.fields.labels.filter((label) =>
      fileContent.toLowerCase().includes(label.toLowerCase())
    );
    if (modifiedLabels.length === 0) {
      return issue;
    }
    return {
      ...issue,
      fields: {
        ...issue.fields,
        labels: modifiedLabels,
      },
    };
  });
  const recentData = filteredData.filter((issue) => issue.fields.status.name !== "Closed" && issue.fields.status.name !== "In Prevention" && issue.fields.status.name !== "Stable");
  const preventionData = filteredData.filter((issue) => issue.fields.status.name === "In Prevention");
  const closedData = filteredData.filter((issue) => issue.fields.status.name === "Closed");
  const stableData = filteredData.filter((issue) => issue.fields.status.name === "Stable");

  const ages_recentData = recentData.map((issue) => calculateAge(issue.fields.created));
  const meanAge_recentData = ages_recentData.length > 0 ? Math.round(ages_recentData.reduce((a, b) => a + b) / ages_recentData.length) : 0;

  const ages_preventionData = preventionData.map((issue) => calculateAge(issue.fields.customfield_10604));
  const meanAge_preventionData = ages_preventionData.length > 0 ? Math.round(ages_preventionData.reduce((a, b) => a + b) / ages_preventionData.length) : 0;

  const ages_stableData = stableData.map((issue) => calculateAge(issue.fields.customfield_10604));
  const meanAge_stableData = ages_stableData.length > 0 ? Math.round(ages_stableData.reduce((a, b) => a + b) / ages_stableData.length) : 0;
  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div>
        <h1 style={{ textAlign: 'center' }}>CIRS</h1>
        {recentData.length > 0 && (
          <div>
            <h2>Recent Open CIRS : {recentData.length}</h2>
            <h3 style={{ textAlign: 'left' }}>Mean Backlog Age (Actual): {meanAge_recentData}</h3>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>CIRS Responsible Team</th>
                  <th>CIRS Score</th>
                  <th>CIRS Impact</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
              {_.sortBy(recentData, (issue) => -calculateActualAge(issue.fields.created)).map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.created)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.created)}</td>
                    <td>{issue.fields.customfield_14907.value}</td>
                    <td>{issue.fields.customfield_21602}</td>
                    <td>{issue.fields.customfield_14910.value}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {preventionData.length > 0 && (
          <div>
            <h2>Preventive Actions Open : {preventionData.length}</h2>
            <h3 style={{ textAlign: 'left' }}>Mean Backlog Age (Actual): {meanAge_preventionData}</h3>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>CIRS Responsible Team</th>
                  <th>CIRS Score</th>
                  <th>CIRS Impact</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
              {_.sortBy(preventionData, (issue) => -calculateActualAge(issue.fields.customfield_10604)).map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.customfield_10604)}</td>
                    <td>{issue.fields.customfield_14907.value}</td>
                    <td>{issue.fields.customfield_21602}</td>
                    <td>{issue.fields.customfield_14910.value}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {stableData.length > 0 && (
          <div>
            <h2>RCAs Open : {stableData.length}</h2>
            <h3 style={{ textAlign: 'left' }}>Mean Backlog Age (Actual): {meanAge_stableData}</h3>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>CIRS Responsible Team</th>
                  <th>CIRS Score</th>
                  <th>CIRS Impact</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
              {_.sortBy(stableData, (issue) => -calculateActualAge(issue.fields.customfield_10604)).map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.customfield_10604)}</td>
                    <td>{issue.fields.customfield_14907.value}</td>
                    <td>{issue.fields.customfield_21602}</td>
                    <td>{issue.fields.customfield_14910.value}</td>
                    <td>{issue.fields.labels.join('   ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
                {closedData.length > 0 && (
          <div>
            <h2>Closed Issues :{closedData.length}</h2>
            <Table striped bordered hover size="sm" className="table-blue">
              <thead style={{ fontSize: 16 }}>
                <tr style={{ textAlign: 'center' }}>
                  <th>S.No</th>
                  <th>Issue ID</th>
                  <th>Summary</th>
                  <th>Created Date</th>
                  <th>Days Open</th>
                  <th>Working Days</th>
                  <th>CIRS Responsible Team</th>
                  <th>CIRS Score</th>
                  <th>CIRS Impact</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 14 }}>
              {_.sortBy(closedData, (issue) => calculateActualAge(issue.fields.customfield_10604)).map((issue, index) => (
                  <tr key={issue.key}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ width: 100, textAlign: "center" }}>
                      <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                        {issue.key}
                      </a>
                    </td>
                    <td style={{ textAlign: 'left' }}>{issue.fields.summary}</td>
                    <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.customfield_10604)}</td>
                    <td style={{ textAlign: 'center' }}>{calculateAge(issue.fields.customfield_10604)}</td>
                    <td>{issue.fields.customfield_14907.value}</td>
                    <td>{issue.fields.customfield_21602}</td>
                    <td>{issue.fields.customfield_14910.value}</td>
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

export default Cirs;
