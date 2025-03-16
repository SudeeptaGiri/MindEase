// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    console.log(localStorage.getItem('userId'));
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/assessments/user/${localStorage.getItem('userId')}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Your Assessment History</h3>
      {assessments.length > 0 ? (
        <ul>
          {assessments.map((assessment) => (
            <li key={assessment.id}>
              <p>Type: {assessment.assessmentType}</p>
              <p>Score: {assessment.score}</p>
              <p>Risk Level: {assessment.riskLevel}</p>
              <p>Follow-Up Date: {assessment.followUpDate}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assessments found.</p>
      )}
    </div>
  );
};

export default Dashboard;