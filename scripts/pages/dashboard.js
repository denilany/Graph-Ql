import { SideBar } from "../components/sidebar.js";
import { Dashboard } from "../components/dashboard_content.js";

export class Dashboard {
    static getTemplate () {
        return `
         <div id="dashboard-container" class="dashboard hidden">
            ${SideBar.getTemplate()}
            ${Dashboard.getTemplate()}
         </div>
         `;
    }
}