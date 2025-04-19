import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
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
  FaArrowLeft
} from 'react-icons/fa';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, riskLevel, assessmentType, followUpDate } = location.state || {};
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state) {
      navigate('/assessment');
      return;
    }

    const fetchSuggestions = async () => {
      if (!score || !assessmentType) return;

      setLoading(true);
      setError('');

      const API_KEY = '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';

      const prompt = `Based on my ${assessmentType} score of ${score} and risk level of ${riskLevel}, create a structured wellness roadmap until my next follow-up on ${followUpDate}. Please organize the suggestions into these categories:

1. Daily Practices (3-4 essential daily tasks)
2. Weekly Goals (2-3 important weekly activities)
3. Social Connections (2-3 ways to maintain relationships)
4. Self-Care Activities (2-3 relaxation or wellness activities)
5. Professional Support (if needed, based on risk level)

For each category, provide clear, actionable tasks. Format each task as a concise, specific action item starting with a verb.`;

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Mental Health Assistant',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();
        const content = data.choices[0].message.content;
        const categories = parseCategories(content);
        setTasks(categories);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to fetch suggestions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [score, riskLevel, assessmentType, followUpDate, location.state, navigate]);

  const parseCategories = (content) => {
    const categories = {
      daily: { title: 'Daily Practices', tasks: [], icon: FaSun, color: 'yellow' },
      weekly: { title: 'Weekly Goals', tasks: [], icon: FaCalendarAlt, color: 'blue' },
      social: { title: 'Social Connections', tasks: [], icon: FaUsers, color: 'purple' },
      selfCare: { title: 'Self-Care Activities', tasks: [], icon: FaHeart, color: 'red' },
      professional: { title: 'Professional Support', tasks: [], icon: FaBriefcase, color: 'green' }
    };

    let currentCategory = null;
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;

      // Check for category headers
      Object.keys(categories).forEach(key => {
        if (line.toLowerCase().includes(categories[key].title.toLowerCase())) {
          currentCategory = key;
        }
      });

      // If it's a task (starts with - or • or number)
      if ((line.match(/^[-•\d.]\s+/) || line.match(/^\w+/)) && currentCategory) {
        const taskText = line.replace(/^[-•\d.]\s*/, '').trim();
        if (taskText) {
          categories[currentCategory].tasks.push({ text: taskText, done: false });
        }
      }
    });

    return categories;
  };

  const handleCheckboxChange = (category, index) => {
    setTasks(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        tasks: prev[category].tasks.map((task, i) => 
          i === index ? { ...task, done: !task.done } : task
        )
      }
    }));
  };

  // Continue to Part 2...
    // ... continuing from Part 1

    const exportPDF = () => {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(0, 128, 128);
      doc.text("Mental Health Wellness Roadmap", 14, 20);
      
      // Add assessment info
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Assessment Type: ${assessmentType}`, 14, 35);
      doc.text(`Score: ${score}`, 14, 45);
      doc.text(`Risk Level: ${riskLevel}`, 14, 55);
      doc.text(`Follow-up Date: ${followUpDate}`, 14, 65);
  
      let yPos = 85;
  
      // Add categories and tasks
      Object.entries(tasks).forEach(([key, category]) => {
        if (category.tasks.length > 0) {
          // Add category title
          doc.setFontSize(14);
          doc.setTextColor(0, 128, 128);
          doc.text(category.title, 14, yPos);
          yPos += 10;
  
          // Add tasks
          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);
          category.tasks.forEach((task, index) => {
            const taskText = `${index + 1}. ${task.text} ${task.done ? '✓' : ''}`;
            doc.text(taskText, 20, yPos);
            yPos += 8;
          });
          yPos += 10;
        }
      });
      
      doc.save("mental_health_roadmap.pdf");
    };
  
    const exportCSV = () => {
      let csvContent = "Category,Task,Status\n";
      
      Object.entries(tasks).forEach(([_, category]) => {
        category.tasks.forEach(task => {
          csvContent += `"${category.title}","${task.text}","${task.done ? 'Completed' : 'Pending'}"\n`;
        });
      });
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, "mental_health_roadmap.csv");
    };
  
    const addToCalendar = () => {
      let calendarEvents = '';
      let currentDate = new Date();
      
      Object.entries(tasks).forEach(([key, category]) => {
        category.tasks.forEach((task, index) => {
          const taskDate = new Date(currentDate);
          taskDate.setDate(taskDate.getDate() + index);
          
          const event = `BEGIN:VEVENT
  SUMMARY:${category.title}: ${task.text}
  DTSTART:${taskDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
  DTEND:${taskDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
  DESCRIPTION:${category.title} task from your mental health roadmap
  END:VEVENT\n`;
  
          calendarEvents += event;
        });
      });
  
      const calendarData = `BEGIN:VCALENDAR\nVERSION:2.0\n${calendarEvents}END:VCALENDAR`;
      const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8;' });
      saveAs(blob, 'mental_health_tasks.ics');
    };
  
    if (!location.state) return null;
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
  
          {/* Results Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment Results</h2>
            
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
                <p className="text-sm text-teal-600 font-medium">Follow-Up Date</p>
                <p className="text-2xl font-bold text-teal-700">{new Date(followUpDate).toLocaleDateString()}</p>
              </div>
            </div>
  
            {/* Roadmap Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Wellness Roadmap</h3>
              
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
              )}
  
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}
  
              {!loading && !error && (
                <div className="space-y-6">
                  {Object.entries(tasks).map(([key, category]) => 
                    category.tasks.length > 0 && (
                      <div key={key} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                        <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                          {React.createElement(category.icon, { 
                            className: `h-6 w-6 mr-2 text-${category.color}-500` 
                          })}
                          {category.title}
                        </h4>
                        <div className="space-y-3">
                          {category.tasks.map((task, index) => (
                            <div
                              key={index}
                              className={`flex items-start p-4 rounded-lg transition-all duration-200 ${
                                task.done ? 'bg-green-50' : 'bg-gray-50'
                              } hover:shadow-sm`}
                            >
                              <button
                                onClick={() => handleCheckboxChange(key, index)}
                                className="flex-shrink-0 mt-0.5 focus:outline-none"
                              >
                                {task.done ? (
                                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                                )}
                              </button>
                              <span className={`ml-3 text-gray-700 ${
                                task.done ? 'line-through text-gray-500' : ''
                              }`}>
                                {task.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
  
                  {/* Export Options */}
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Results;