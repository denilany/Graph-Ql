import { SideBar } from "../components/sidebar.js";
import { DashboardContent } from "../components/dashboard_content.js";

export class Dashboard {
    static getTemplate () {
        return `
         <div id="dashboard-container" class="dashboard">
            ${SideBar.getTemplate()}
            ${DashboardContent.getTemplate()}
         </div>
         `;
    }
}