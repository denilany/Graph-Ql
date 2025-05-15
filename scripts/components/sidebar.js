export class SideBar {
    static getTemplate() {
        return `
        <div class="sidebar">
            <div class="sidebar-header">
                <img src="assets/logo.png" alt="Dashboard Logo" class="sidebar-logo">
                <h2>Dashboard</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li class="active" data-section="profile"><i class="fas fa-user"></i> Profile</li>
                    <li data-section="statistics"><i class="fas fa-chart-line"></i> Statistics</li>
                    <li data-section="skills"><i class="fas fa-code"></i> Skills</li>
                    <li data-section="audits"><i class="fas fa-clipboard-check"></i> Audits</li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <button id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        </div>
        `;
    }
}