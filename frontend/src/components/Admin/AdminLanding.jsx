import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SharedStyles.css';

const AdminLanding = () => {
    const navigate = useNavigate();

    const dashboardCards = [
        {
            title: 'Student Reports',
            description: 'View and analyze individual student feedback reports',
            icon: '📊',
            path: '/admin/student-reports',
            color: '#4CAF50'
        },
        {
            title: 'Faculty Reports',
            description: 'Access comprehensive faculty feedback analysis',
            icon: '👨‍🏫',
            path: '/admin/faculty-reports',
            color: '#2196F3'
        },
        {
            title: 'Add Students',
            description: 'Manage student enrollment and data',
            icon: '👥',
            path: '/admin/add-students',
            color: '#FF9800'
        },
        {
            title: 'Add Courses',
            description: 'Configure and manage course information',
            icon: '📚',
            path: '/admin/add-courses',
            color: '#E91E63'
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="dashboard-subtitle">Manage and monitor feedback system</p>
            </div>

            <div className="card-grid">
                {dashboardCards.map((card, index) => (
                    <div
                        key={index}
                        className="dashboard-card"
                        onClick={() => navigate(card.path)}
                        style={{ cursor: 'pointer', borderTop: `4px solid ${card.color}` }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{card.icon}</div>
                        <h3 className="dashboard-card-header">{card.title}</h3>
                        <p style={{ color: 'var(--light-text)' }}>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminLanding;
