import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminOverview } from '../../services/adminService';
import './AdminOverviewPage.css';

const AdminOverviewPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [dashboardData, setDashboardData] = useState({ metrics: [], quickActions: [], activities: [], chartData: [] });

  useEffect(() => {
    getAdminOverview().then((response) => {
      const data = response?.data || response || {};
      setDashboardData({
        metrics: data.metrics || [],
        quickActions: data.quickActions || [],
        activities: data.activities || data.platformActivities || [],
        chartData: data.chartData || []
      });
    }).catch(() => setDashboardData({ metrics: [], quickActions: [], activities: [], chartData: [] }));
  }, []);

  const { metrics, quickActions, activities: platformActivities, chartData } = dashboardData;

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <AdminLayout activeMenu="overview" showSearch={true}>
      <div className="admin-overview-page">
        {/* Page Header */}
        <div className="overview-header">
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">Key metrics and platform activity for today.</p>
          </div>
          <button className="date-range-btn">
            📅 Last 30 Days
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-icon">{metric.icon}</div>
              <p className="metric-label">{metric.title}</p>
              <p className="metric-value">{metric.value}</p>
              {metric.subtitle && (
                <p className="metric-subtitle">{metric.subtitle}</p>
              )}
              {metric.trend && (
                <p className={`metric-trend ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.positive ? '📈' : '📉'} {metric.trend}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="overview-grid">
          {/* Sales Trends */}
          <div className="sales-section">
            <div className="section-header">
              <h2 className="section-title">Sales Trends</h2>
              <div className="time-toggle">
                <button 
                  className={`toggle-btn ${timeRange === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeRange('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`toggle-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-bars">
                {chartData.map((data, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                      <div 
                        className={`bar ${index === chartData.length - 1 ? 'active' : ''}`}
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-axis">
                <span>$0</span>
                <span>$50k</span>
                <span>$100k</span>
                <span>$150k</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="overview-sidebar">
            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3 className="section-title">Quick Actions</h3>
              <div className="actions-list">
                {quickActions.map((action, index) => (
                  <div key={index} className={`action-item action-${action.color}`}>
                    <span className="action-icon">{action.icon}</span>
                    <div className="action-content">
                      <p className="action-title">{action.title}</p>
                      <p className="action-subtitle">{action.subtitle}</p>
                    </div>
                    <span className="action-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Activity */}
            <div className="platform-activity-section">
              <div className="activity-header">
                <h3 className="section-title">Platform Activity</h3>
                <a href="#" className="view-all-link">View All</a>
              </div>
              <div className="activity-list">
                {platformActivities.map((activity, index) => (
                  <div key={index} className={`activity-item activity-${activity.color}`}>
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-description">{activity.description}</p>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverviewPage;
