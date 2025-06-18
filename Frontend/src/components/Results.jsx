// src/components/Results.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import confetti from "canvas-confetti";
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
  FaTasks,
  FaShareAlt,
  FaInfoCircle,
  FaChartLine
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
  const [activeCategory, setActiveCategory] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [exportLoading, setExportLoading] = useState({
    pdf: false,
    csv: false,
    calendar: false,
    todo: false
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const confettiRef = useRef(null);
  const progressCircleRef = useRef(null);

  // Animation references
  const scoreRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!location.state) {
      navigate("/assessment");
      return;
    }

    if (initialSuggestions) {
      initializeSuggestions(initialSuggestions);
      // Show celebration animation on initial load
      setTimeout(() => {
        setShowCelebration(true);
        if (confettiRef.current) {
          launchConfetti();
        }
      }, 500);
    } else {
      fetchSuggestions();
    }

    // Initialize animations
    if (scoreRef.current) {
      animateScore();
    }

    // Draw progress circle
    if (progressCircleRef.current) {
      drawProgressCircle();
    }
  }, [location.state, navigate, initialSuggestions]);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']
    });
  };

  const animateScore = () => {
    gsap.fromTo(
      scoreRef.current,
      { textContent: 0 },
      {
        textContent: score,
        duration: 1.5,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: function() {
          scoreRef.current.textContent = Math.round(this.targets()[0].textContent);
        }
      }
    );
  };

  const drawProgressCircle = () => {
    const canvas = progressCircleRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    
    // Determine max score based on assessment type
    const maxScore = assessmentType === 'PHQ-9' ? 27 : assessmentType === 'GAD-7' ? 21 : 100;
    const percentage = score / maxScore;
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * percentage));
    ctx.strokeStyle = getRiskColor(riskLevel);
    ctx.lineWidth = 15;
    ctx.stroke();
  };

  const getRiskColor = (risk) => {
    if (risk.includes('Severe')) return '#ef4444';
    if (risk.includes('Moderate')) return '#f59e0b';
    if (risk.includes('Mild')) return '#10b981';
    return '#14b8a6';
  };

  const getRiskBackground = (risk) => {
    if (risk.includes('Severe')) return 'bg-red-50';
    if (risk.includes('Moderate')) return 'bg-amber-50';
    if (risk.includes('Mild')) return 'bg-emerald-50';
    return 'bg-teal-50';
  };

  const getRiskText = (risk) => {
    if (risk.includes('Severe')) return 'text-red-700';
    if (risk.includes('Moderate')) return 'text-amber-700';
    if (risk.includes('Mild')) return 'text-emerald-700';
    return 'text-teal-700';
  };

  const initializeSuggestions = (suggestionsData) => {
    // Initialize task status for each task
    const initialStatus = {};
    Object.entries(suggestionsData.categories).forEach(([category, data]) => {
      initialStatus[category] = data.tasks.map(() => false);
    });
    setTaskStatus(initialStatus);
    setSuggestions(suggestionsData);
    setActiveCategory(Object.keys(suggestionsData.categories)[0]);
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
    setTaskStatus((prev) => {
      const updatedStatus = {
        ...prev,
        [category]: prev[category].map((status, i) =>
          i === taskIndex ? !status : status
        ),
      };
      
      // Check if all tasks are completed
      const allCompleted = Object.values(updatedStatus).every(categoryTasks => 
        categoryTasks.every(status => status)
      );
      
      if (allCompleted) {
        setTimeout(() => {
          launchConfetti();
        }, 300);
      }
      
      return updatedStatus;
    });
  };

  const exportPDF = async () => {
    setExportLoading(prev => ({ ...prev, pdf: true }));
    
    try {
      const doc = new jsPDF();

      // Add header with logo-like styling
      doc.setFillColor(13, 148, 136); // Teal color
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Mental Health Wellness Plan", 14, 20);

      // Add assessment info
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text(`Assessment Type: ${assessmentType}`, 14, 45);
      doc.text(`Score: ${score}`, 14, 55);
      doc.text(`Risk Level: ${riskLevel}`, 14, 65);
      doc.text(`Follow-up Date: ${new Date(followUpDate).toLocaleDateString()}`, 14, 75);

      let yPos = 95;

      // Add categories and tasks
      if (suggestions) {
        Object.entries(suggestions.categories).forEach(([key, category]) => {
          // Add category title
          doc.setFillColor(240, 253, 250); // Light teal background
          doc.rect(10, yPos - 6, doc.internal.pageSize.getWidth() - 20, 10, 'F');
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(13, 148, 136); // Teal color
          doc.text(category.title, 14, yPos);
          yPos += 15;

          // Add tasks
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);
          category.tasks.forEach((task, index) => {
            const status = taskStatus[key][index] ? "✓" : "□";
            const taskText = `${status} ${task}`;
            
            // Check if we need a new page
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            
            doc.text(taskText, 20, yPos);
            yPos += 10;
          });
          yPos += 10;
        });
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`, 
          doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: "center" }
        );
      }

      doc.save("mental_health_plan.pdf");
      
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExportLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const exportCSV = async () => {
    if (!suggestions) return;
    
    setExportLoading(prev => ({ ...prev, csv: true }));
    
    try {
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
      
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    } finally {
      setExportLoading(prev => ({ ...prev, csv: false }));
    }
  };

  const addToCalendar = async () => {
    if (!suggestions) return;
    
    setExportLoading(prev => ({ ...prev, calendar: true }));
    
    try {
      let calendarEvents = "";
      let currentDate = new Date();

      Object.entries(suggestions.categories).forEach(([key, category]) => {
        category.tasks.forEach((task, index) => {
          const taskDate = new Date(currentDate);
          taskDate.setDate(taskDate.getDate() + index);
          
          // Format dates properly for iCalendar
          const startDate = taskDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          const endDate = new Date(taskDate.getTime() + 3600000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

          const event = `BEGIN:VEVENT
SUMMARY:${category.title}: ${task}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${category.title} task from your mental health plan
END:VEVENT\n`;

          calendarEvents += event;
        });
      });

      const calendarData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MentalHealthApp//EN\n${calendarEvents}END:VCALENDAR`;
      const blob = new Blob([calendarData], {
        type: "text/calendar;charset=utf-8;",
      });
      saveAs(blob, "mental_health_tasks.ics");
      
      toast.success("Calendar events created successfully!");
    } catch (error) {
      console.error("Error creating calendar events:", error);
      toast.error("Failed to create calendar events");
    } finally {
      setExportLoading(prev => ({ ...prev, calendar: false }));
    }
  };

  const saveToTodoList = async () => {
    setExportLoading(prev => ({ ...prev, todo: true }));
    
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
      
      // Show confetti on success
      launchConfetti();
      
      return response.data;
    } catch (error) {
      console.error("Error saving to todo list:", error);
      toast.error("Failed to save tasks to todo list");
    } finally {
      setExportLoading(prev => ({ ...prev, todo: false }));
    }
  };

  const calculateCompletionPercentage = () => {
    if (!taskStatus || Object.keys(taskStatus).length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    Object.entries(taskStatus).forEach(([category, tasks]) => {
      totalTasks += tasks.length;
      completedTasks += tasks.filter(status => status).length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-teal-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
          <div className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        </div>
      </div>
      
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>
      
      {/* Celebration modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCelebration(false)}></div>
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl relative z-10 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
                  <FaCheckCircle className="h-12 w-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your personalized wellness plan is ready. Start your journey to better mental health today.
                </p>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  View My Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex items-center text-teal-600 hover:text-teal-700 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                Your Assessment Results
              </h2>
              <p className="opacity-90">
                {assessmentType} • Completed {new Date().toLocaleDateString()}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                <p className="text-gray-500">Loading your personalized plan...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-6 m-6 rounded-xl flex items-start">
                <FaInfoCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">We encountered an issue</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                    >
                      <div className="p-6 flex flex-col items-center text-center">
                        <div className="relative mb-3">
                          <canvas ref={progressCircleRef} width="160" height="160" className="mx-auto"></canvas>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span ref={scoreRef} className="text-4xl font-bold text-gray-800">{score}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Assessment Score</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {assessmentType === 'PHQ-9' ? 'Depression Screening' : 
                           assessmentType === 'GAD-7' ? 'Anxiety Screening' : 'Mental Health Assessment'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`rounded-xl overflow-hidden shadow-md border border-gray-100 ${getRiskBackground(riskLevel)}`}
                    >
                      <div className="p-6 flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full mb-3 ${getRiskBackground(riskLevel)}`}>
                          <FaChartLine className={`h-8 w-8 ${getRiskText(riskLevel)}`} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Risk Level</h3>
                        <p className={`text-xl font-semibold mt-1 ${getRiskText(riskLevel)}`}>
                          {riskLevel}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                    >
                      <div className="p-6 flex flex-col items-center text-center">
                        <div className="p-3 bg-blue-50 rounded-full mb-3">
                          <FaCalendarAlt className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Follow-Up Date</h3>
                        <p className="text-xl font-semibold mt-1">
                          {new Date(followUpDate).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Your Personalized Wellness Plan
                      </h3>
                      <div className="relative">
                        <button 
                          onClick={() => setShowShareOptions(!showShareOptions)}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Share options"
                        >
                          <FaShareAlt className="h-5 w-5 text-gray-600" />
                        </button>
                        
                        {/* Share options dropdown */}
                        <AnimatePresence>
                          {showShareOptions && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100"
                            >
                              <button
                                onClick={() => {
                                  exportPDF();
                                  setShowShareOptions(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FaFilePdf className="mr-3 text-red-500" />
                                Export as PDF
                              </button>
                              <button
                                onClick={() => {
                                  exportCSV();
                                  setShowShareOptions(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FaFileExcel className="mr-3 text-green-600" />
                                Export as CSV
                              </button>
                              <button
                                onClick={() => {
                                  addToCalendar();
                                  setShowShareOptions(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <FaCalendarPlus className="mr-3 text-blue-600" />
                                Add to Calendar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500">Plan Completion</span>
                        <span className="text-sm font-medium text-teal-600">{completionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-teal-500"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Category tabs */}
                    <div className="mb-6 overflow-x-auto scrollbar-hide">
                      <div className="flex space-x-2 pb-2">
                        {suggestions &&
                          Object.entries(suggestions.categories).map(([key, category]) => (
                            <motion.button
                              key={key}
                              whileHover={{ y: -2 }}
                              whileTap={{ y: 0 }}
                              onClick={() => setActiveCategory(key)}
                              className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-all ${
                                activeCategory === key
                                  ? "bg-teal-600 text-white shadow-md"
                                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                              }`}
                            >
                              {React.createElement(getCategoryIcon(key), {
                                className: `h-4 w-4 ${activeCategory === key ? "text-white" : "text-teal-500"} mr-2`,
                              })}
                              {category.title}
                              {taskStatus[key] && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                  activeCategory === key
                                    ? "bg-white text-teal-600"
                                    : "bg-teal-100 text-teal-600"
                                }`}>
                                  {taskStatus[key].filter(status => status).length}/{taskStatus[key].length}
                                </span>
                              )}
                            </motion.button>
                          ))}
                      </div>
                    </div>

                    {/* Active category tasks */}
                    <AnimatePresence mode="wait">
                      {suggestions && activeCategory && (
                        <motion.div
                          key={activeCategory}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="space-y-3">
                              {suggestions.categories[activeCategory].tasks.map((task, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: index * 0.1 }
                                  }}
                                  whileHover={{ scale: 1.01 }}
                                  className={`flex items-start p-4 rounded-lg transition-all duration-200 ${
                                    taskStatus[activeCategory]?.[index]
                                      ? "bg-green-50 border border-green-100"
                                      : "bg-gray-50 border border-gray-100"
                                  } hover:shadow-md`}
                                >
                                  <button
                                    onClick={() => handleTaskToggle(activeCategory, index)}
                                    className="flex-shrink-0 mt-0.5 focus:outline-none"
                                    aria-label={taskStatus[activeCategory]?.[index] ? "Mark as incomplete" : "Mark as complete"}
                                  >
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      {taskStatus[activeCategory]?.[index] ? (
                                        <FaCheckCircle className="h-6 w-6 text-green-500" />
                                      ) : (
                                        <FaRegCircle className="h-6 w-6 text-gray-400 hover:text-teal-500" />
                                      )}
                                    </motion.div>
                                  </button>
                                  <span
                                    className={`ml-3 text-gray-700 ${
                                      taskStatus[activeCategory]?.[index]
                                        ? "line-through text-gray-500"
                                        : ""
                                    }`}
                                  >
                                    {task}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={saveToTodoList}
                        disabled={exportLoading.todo}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                      >
                        {exportLoading.todo ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaListAlt className="mr-2 h-5 w-5" />
                            Keep Going
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Information card */}
                <div className="bg-blue-50 p-6 border-t border-blue-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaInfoCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">What's Next?</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Your follow-up assessment is scheduled for {new Date(followUpDate).toLocaleDateString()}. 
                          Complete the tasks in your wellness plan and track your progress. 
                          Remember, small steps lead to significant improvements in your mental well-being.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;