// src/components/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FaFilePdf,
  FaFileExcel,
  FaCalendarPlus,
  FaCheckCircle,
  FaRegCircle,
  FaSun,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaBriefcase,
  FaArrowLeft,
  FaListAlt,
  FaTasks
} from "react-icons/fa";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    score,
    riskLevel,
    assessmentType,
    followUpDate,
    suggestions: initialSuggestions,
    id: assessmentId,
  } = location.state || {};

  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskStatus, setTaskStatus] = useState({});

  useEffect(() => {
    if (!location.state) {
      navigate("/assessment");
      return;
    }

    if (initialSuggestions) {
      initializeSuggestions(initialSuggestions);
    } else {
      fetchSuggestions();
    }
  }, [location.state, navigate, initialSuggestions]);

  const initializeSuggestions = (suggestionsData) => {
    // Initialize task status for each task
    const initialStatus = {};
    Object.entries(suggestionsData.categories).forEach(([category, data]) => {
      initialStatus[category] = data.tasks.map(() => false);
    });
    setTaskStatus(initialStatus);
    setSuggestions(suggestionsData);
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/assessments/${assessmentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch assessment data");

      const data = await response.json();
      const parsedSuggestions = JSON.parse(data.suggestions);
      initializeSuggestions(parsedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to load suggestions");
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      daily: FaSun,
      weekly: FaCalendarAlt,
      social: FaUsers,
      selfCare: FaHeart,
      professional: FaBriefcase,
    };
    return icons[category] || FaSun;
  };

  const handleTaskToggle = (category, taskIndex) => {
    setTaskStatus((prev) => ({
      ...prev,
      [category]: prev[category].map((status, i) =>
        i === taskIndex ? !status : status
      ),
    }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128);
    doc.text("Mental Health Wellness Plan", 14, 20);

    // Add assessment info
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Assessment Type: ${assessmentType}`, 14, 35);
    doc.text(`Score: ${score}`, 14, 45);
    doc.text(`Risk Level: ${riskLevel}`, 14, 55);
    doc.text(`Follow-up Date: ${followUpDate}`, 14, 65);

    let yPos = 85;

    // Add categories and tasks
    if (suggestions) {
      Object.entries(suggestions.categories).forEach(([key, category]) => {
        // Add category title
        doc.setFontSize(14);
        doc.setTextColor(0, 128, 128);
        doc.text(category.title, 14, yPos);
        yPos += 10;

        // Add tasks
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        category.tasks.forEach((task, index) => {
          const status = taskStatus[key][index] ? "✓" : "□";
          const taskText = `${status} ${task}`;
          doc.text(taskText, 20, yPos);
          yPos += 8;
        });
        yPos += 10;
      });
    }

    doc.save("mental_health_plan.pdf");
  };

  const exportCSV = () => {
    if (!suggestions) return;

    let csvContent = "Category,Task,Status\n";

    Object.entries(suggestions.categories).forEach(([key, category]) => {
      category.tasks.forEach((task, index) => {
        csvContent += `"${category.title}","${task}","${
          taskStatus[key][index] ? "Completed" : "Pending"
        }"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "mental_health_plan.csv");
  };

  const addToCalendar = () => {
    if (!suggestions) return;

    let calendarEvents = "";
    let currentDate = new Date();

    Object.entries(suggestions.categories).forEach(([key, category]) => {
      category.tasks.forEach((task, index) => {
        const taskDate = new Date(currentDate);
        taskDate.setDate(taskDate.getDate() + index);

        const event = `BEGIN:VEVENT
SUMMARY:${category.title}: ${task}
DTSTART:${taskDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${taskDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DESCRIPTION:${category.title} task from your mental health plan
END:VEVENT\n`;

        calendarEvents += event;
      });
    });

    const calendarData = `BEGIN:VCALENDAR\nVERSION:2.0\n${calendarEvents}END:VCALENDAR`;
    const blob = new Blob([calendarData], {
      type: "text/calendar;charset=utf-8;",
    });
    saveAs(blob, "mental_health_tasks.ics");
  };

  const saveToTodoList = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("Please log in to save tasks");
      }

      // Transform suggestions into the required format
      const categoryTasks = {};
      Object.entries(suggestions.categories).forEach(([key, category]) => {
        // Map the categories to match backend enum
        const backendCategory = key.toUpperCase();
        categoryTasks[backendCategory] = category.tasks;
      });

      const response = await axios.post(
        `http://localhost:8080/api/todos/user/${user.id}/assessment/${assessmentId}`,
        categoryTasks
      );

      toast.success("Tasks added to your todo list!");
      return response.data;
    } catch (error) {
      console.error("Error saving to todo list:", error);
      toast.error("Failed to save tasks to todo list");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Assessment Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-600 font-medium">Score</p>
              <p className="text-2xl font-bold text-teal-700">{score}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-600 font-medium">Risk Level</p>
              <p className="text-2xl font-bold text-teal-700">{riskLevel}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-600 font-medium">
                Follow-Up Date
              </p>
              <p className="text-2xl font-bold text-teal-700">
                {new Date(followUpDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Personalized Wellness Plan
              </h3>

              {suggestions &&
                Object.entries(suggestions.categories).map(
                  ([key, category]) => (
                    <div
                      key={key}
                      className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg"
                    >
                      <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                        {React.createElement(getCategoryIcon(key), {
                          className: "h-6 w-6 mr-2 text-teal-500",
                        })}
                        {category.title}
                      </h4>
                      <div className="space-y-3">
                        {category.tasks.map((task, index) => (
                          <div
                            key={index}
                            className={`flex items-start p-4 rounded-lg transition-all duration-200 ${
                              taskStatus[key]?.[index]
                                ? "bg-green-50"
                                : "bg-gray-50"
                            } hover:shadow-sm`}
                          >
                            <button
                              onClick={() => handleTaskToggle(key, index)}
                              className="flex-shrink-0 mt-0.5 focus:outline-none"
                            >
                              {taskStatus[key]?.[index] ? (
                                <FaCheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                              )}
                            </button>
                            <span
                              className={`ml-3 text-gray-700 ${
                                taskStatus[key]?.[index]
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={exportPDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <FaFilePdf className="mr-2" />
                  Export to PDF
                </button>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <FaFileExcel className="mr-2" />
                  Export to CSV
                </button>
                <button
                  onClick={addToCalendar}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <FaCalendarPlus className="mr-2" />
                  Add to Calendar
                </button>
                <button
                  onClick={saveToTodoList}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <FaListAlt className="mr-2" />
                  Add to Todo List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
