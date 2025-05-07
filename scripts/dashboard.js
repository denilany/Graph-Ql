import { Dashboard } from "./pages/dashboard.js"
import { GraphQLService } from './graphql.js';
import { gsap } from 'gsap';

const GraphQl = new GraphQLService();

export function switchToDashboard() {
    document.body.innerHTML = "";
    document.body.innerHTML = Dashboard.getTemplate();

    gsap.from('#dashboard-container', {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.sidebar, .main-content', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });
}

export async function loadUserData() {

    const response = await GraphQl.getUserInfo();
    const humanReadable_XP = await totalXP();

    const user = response.user[0];
    console.log('user: ', user);

    try {
        updateProfile(user, humanReadable_XP);
    } catch (error) {
        console.log('Error loading data: ', error);
    }
}

async function totalXP() {
    try {
        const xp_response = await GraphQl.getUserXP();

        if (!xp_response || !Array.isArray(xp_response.transaction)) {
            throw new Error("Invalid response format");
        }

        const totalXP = xp_response.transaction.reduce((sum, t) => sum + (t.amount || 0), 0);

        let humanReadable_XP;
        if (totalXP >= 1_000_000) {
            humanReadable_XP = (totalXP / 1_000_000).toFixed(2) + 'MB';
        } else if (totalXP >= 1_000) {
            humanReadable_XP = (totalXP / 1_000).toFixed(2) + 'KB';
        } else {
            humanReadable_XP = totalXP.toFixed(2);
        }

        return humanReadable_XP;
    } catch (error) {
        console.error("Failed to fetch total XP:", error);
        return "0.00";
    }
}


function updateProfile(user, humanReadable_XP) {
    document.getElementById('user-greeting').textContent = `Hello, ${user.attrs.firstName}`;
    document.getElementById('profile-name').textContent = `${user.login}`;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-xp').textContent = `${humanReadable_XP}`;
    // document.getElementById('profile-projects').textContent = `${stats.projects.completed}/${stats.projects.total}`;
    // document.getElementById('profile-audit-ratio').textContent = stats.audits.ratio.toFixed(2);
}