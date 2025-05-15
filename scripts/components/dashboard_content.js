export class DashboardContent {
    static getTemplate() {
        return `
        <div class="main-content">
            <div class="dashboard-header">
                <div class="hamburger-menu">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="user-info">
                    <span id="user-greeting">Hello, User</span>
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                </div>
            </div>
            
            <div class="content-area">
                <!-- Profile Section -->
                <section id="profile-section" class="dashboard-section active">
                    <h2>My Profile</h2>
                    <div class="profile-card">
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="profile-info">
                                <h3 id="profile-name">Loading...</h3>
                                <p id="profile-email">Loading...</p>
                            </div>
                        </div>
                        <div class="profile-details">
                            <div class="detail-card">
                                <i class="fas fa-trophy"></i>
                                <h4>Total XP</h4>
                                <p id="profile-xp">Loading...</p>
                            </div>
                            <div class="detail-card">
                                <i class="fas fa-check-circle"></i>
                                <h4>Completed Projects</h4>
                                <p id="profile-projects">Loading...</p>
                            </div>
                            <div class="detail-card">
                                <i class="fas fa-star"></i>
                                <h4>Audit Ratio</h4>
                                <p id="profile-audit-ratio">Loading...</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Statistics Section -->
                <section id="statistics-section" class="dashboard-section">
                    <h2>My Statistics</h2>
                    <div class="stats-controls">
                        <select id="graph-selector">
                            <option value="xp-progress">XP Progress Over Time</option>
                            <option value="project-ratio">Project Success Ratio</option>
                        </select>
                    </div>
                    <div class="graph-container" id="graph-container">
                        <!-- Render graphs dynamically -->
                    </div>
                </section>

                <!-- Skills Section -->
                <section id="skills-section" class="dashboard-section">
                    <h2>My Skills</h2>
                    <div class="skills-container">
                        <div id="skills-chart"></div>
                    </div>
                </section>

                <!-- Audits Section -->
                <section id="audits-section" class="dashboard-section">
                    <h2>My Audits</h2>
                    <div class="audits-summary">
                        <div class="detail-card">
                            <i class="fas fa-upload"></i>
                            <h4>Done</h4>
                            <p id="audits-given">Loading...</p>
                        </div>
                        <div class="detail-card">
                            <i class="fas fa-download"></i>
                            <h4>Received</h4>
                            <p id="audits-received">Loading...</p>
                        </div>
                        <div class="detail-card">
                            <i class="fas fa-balance-scale"></i>
                            <h4>Ratio</h4>
                            <p id="audits-ratio">Loading...</p>
                        </div>
                    </div>
                    
                </section>
            </div>
        </div>
        `;
    }
}
