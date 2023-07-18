import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Table from 'react-bootstrap/Table';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import './CustomTable.css';

const Customer = () => {
  const [data, setData] = useState(null);
  const [sortedIssues, setSortedIssues] = useState([]);
  const [priorityTotals, setPriorityTotals] = useState({});
  const [totalAllIssues, setTotalAllIssues] = useState(0);
  const [fileContent, setFileContent] = useState('');
  const [goalsContent, setGoalsContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getProjectsCustomerData");
        const result = response.data;
        setData(result);
        setIsLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    if (data) {
      const sortedArray = [...data?.issues || []].sort((a, b) => {
        const priorityA = a.fields.customfield_16500.value;
        const priorityB = b.fields.customfield_16500.value;
        return priorityA.localeCompare(priorityB);
      });
      setSortedIssues(sortedArray);
    }
  }, [data]);

  useEffect(() => {
    const readFileContent = async () => {
      try {
        const response = await fetch('/teams.txt');
        const content = await response.text();
        setFileContent(content);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    };

    readFileContent();
  }, []);

  useEffect(() => {
    const readGoalsContent = async () => {
      try {
        const response = await fetch('/Customer.txt');
        const content = await response.text();
        setGoalsContent(content);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    };

    readGoalsContent();
  }, []);
 


    const calculateAge = (dateString) => {
      const startDate = new Date(dateString.substring(0, 10)); // Extract yyyy-mm-dd part of the string
      const endDate = new Date();
    
      // Adjust start and end dates to the beginning of the day
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    
      let businessDays = 0;
      let currentDate = new Date(startDate);
    
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
    
        // Exclude weekends (Saturday: 6, Sunday: 0)
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
      const startDate = new Date(dateString.substring(0, 10)); // Extract yyyy-mm-dd part of the string
      const endDate = new Date();
    
      // Adjust start and end dates to the beginning of the day
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffInDays = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1; // Add 1 to include the start day
    
      return diffInDays;
    };
    
  useEffect(() => {
    const updatePriorityTotals = () => {
      const totals = {};

      ['P1', 'P2', 'P3', 'P4'].forEach((priority) => {
        const filteredIssues = sortedIssues.filter(
          (issue) =>
            issue.fields.customfield_16500.value === priority &&
            (!issue.fields.customfield_10300 || issue.fields.customfield_10300[0]?.value !== 'Security Impact') &&
            issue.fields.customfield_18011 !== null
        );
        totals[priority] = filteredIssues.length;
      });

      setPriorityTotals(totals);
    };

    updatePriorityTotals();
  }, [sortedIssues, setPriorityTotals]);

  useEffect(() => {
    let total = 0;

    for (const key in priorityTotals) {
      total += priorityTotals[key];
    }

    setTotalAllIssues(total);
  }, [priorityTotals]);

  const renderTable = (priority) => {
    const filteredIssues = sortedIssues.filter(
      (issue) =>
        issue.fields.customfield_16500.value === priority &&
        (!issue.fields.customfield_10300 || issue.fields.customfield_10300[0]?.value !== 'Security Impact') &&
        issue.fields.customfield_18011 !== null
    );

    const modifiedRows = filteredIssues.map((issue) => {
      const modifiedLabels = issue.fields.labels.filter((label) => fileContent.toLowerCase().includes(label.toLowerCase()));

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
    const fixed = (ver) =>{

      if(ver.length>0){

        return ver[0].name;

      }

      else{

        return ;

      }

    }
    const sortedRows = modifiedRows.sort((a, b) => {
      const daysOpenA = calculateActualAge(a.fields.customfield_18011);
      const daysOpenB = calculateActualAge(b.fields.customfield_18011);
      return daysOpenB - daysOpenA;
    });

    const ages = sortedRows.map((issue) => calculateAge(issue.fields.customfield_18011));
    const meanAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b) / ages.length) : 0;

    let serialNumber = 1;
    const totalIssues = filteredIssues.length;

    const meanBacklogAge = goalsContent.split('\n').find((line) => line.startsWith(`${priority} =`));
    const goals = meanBacklogAge ? meanBacklogAge.split('=')[1].trim() : '';

    return (
      <div key={priority}>
      <h3 style={{ textAlign: 'left' }}>{`Number of ${priority}`} issues = {totalIssues}</h3>
      <h3 style={{ textAlign: 'left' }}>Mean Backlog Age (Actual): {meanAge}</h3>
      <h3 style={{ textAlign: 'left' }}>Mean Backlog Age (Goals): {goals}</h3>
      <Table striped bordered hover size="sm" className="table-blue ">
          <thead style={{ fontSize: 16 }}>
            <tr style={{ textAlign: 'center' }}>
              <th>S.no</th>
              <th>Issue ID</th>
              <th>Issue Priority</th>
              <th>Summary</th>
              <th>Created Date</th>
              <th>Days Open</th>
              <th>Working Days</th>
              <th>Fix Versions</th>
              <th>Labels</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: 14 }}>
          {sortedRows.map((issue) => (
            <tr
              key={issue.key}
              style={
                goals && calculateAge(issue.fields.customfield_18011) > goals ? { border: '2px solid red' } : {}
              }>
                <td style={{ textAlign: 'center' }}>{serialNumber++}</td>
                <td style={{ width: 100, textAlign: 'center' }}>
                  <a href={`https://product-jira.ariba.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                    {issue.key}
                  </a>
                </td>
                <td style={{ textAlign: 'center' }}>{issue.fields.customfield_16500.value}</td>
                <td style={{ textAlign: 'left' }}>{issue.fields.summary}</td>
                <td style={{ width: 110, textAlign: 'center' }}>{formatDate(issue.fields.customfield_18011)}</td>
                <td style={{ textAlign: 'center' }}>{calculateActualAge(issue.fields.customfield_18011)}</td>
                <td
              style={{
                textAlign: 'center',
                color:
                  goals && calculateAge(issue.fields.customfield_18011) > goals ? 'red' : 'inherit',
              }}
            >
                  {issue.fields.customfield_18011 !== null ? (
                    <span>{calculateAge(issue.fields.customfield_18011)}</span>
                  ) : (
                    <span>Null</span>
                  )}
                </td>
                 <td style={{ textAlign: 'center' }}>{fixed(issue.fields.fixVersions)}</td>
                <td style={{ textAlign: 'left' }}>{issue.fields.labels.join('  ')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };
  const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

return (
  <div className="container d-flex align-items-center justify-content-center">
    {isLoading ? (
      <div className="spinner-container">
        <ClipLoader color={'#123abc'} loading={isLoading} css={override} size={50} />
      </div>
    ) : (
      <div>
        <h2>Total Customer Issues: {totalAllIssues}</h2>
        <h4>
          (P1 = {priorityTotals.P1}, P2 = {priorityTotals.P2}, P3 = {priorityTotals.P3}, P4 = {priorityTotals.P4})
        </h4>
        {['P1', 'P2', 'P3', 'P4'].map((priority) => (
          <div key={priority}>
            <h3 style={{ textAlign: 'center' }}>{`Issue Priority ${priority}`}</h3>
            {renderTable(priority)}
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default Customer;
