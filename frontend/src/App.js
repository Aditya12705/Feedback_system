import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header/Header';
import FeedbackLogin from './components/Login/FeedbackLogin';
import FeedbackForm from './components/Feedback/FeedbackForm';
import FeedbackSubmitted from './components/FeedbackSubmitted/FeedbackSubmitted';
import Admin from './components/Admin/Admin';
import AddCourseData from './components/Admin/AddCourseData';
import AddStudentData from './components/Admin/AddStudentData';
import FeedbackViewer from './components/Admin/FeedbackViewer';
import AdminLanding from './components/Admin/AdminLanding';
import StudentReports from './components/Admin/StudentReports';
import StudentReportView from './components/Admin/StudentReportView'; // Updated import path
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes> {/* Replace Switch with Routes */}
                        <Route path="/" element={<FeedbackLogin />} />
                        <Route path="/feedback" element={<><Header /><FeedbackForm /></>} />
                        <Route path="/feedback-submitted" element={<><Header /><FeedbackSubmitted /></>} />
                        <Route path="/admin" element={<><Header /><AdminLanding /></>} />
                        <Route path="/admin/add-courses" element={<><Header /><AddCourseData /></>} />
                        <Route path="/admin/add-students" element={<><Header /><AddStudentData /></>} />
                        <Route path="/admin/feedback-viewer" element={<><Header /><FeedbackViewer /></>} />
                        <Route path="/admin/student-reports" element={<><Header /><StudentReports /></>} />
                        <Route 
                            path="/student-report/:studentId" 
                            element={<><Header /><StudentReportView /></>} 
                        />
                        <Route path="/admin/faculty-reports" element={<><Header /><Admin /></>} />
                        <Route path="*" element={<><Header /><div>404 - Page Not Found</div></>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;