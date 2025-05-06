import { Dashboard } from "./pages/dashboard.js"
import { GraphQLService } from './graphql.js';
import { gsap } from 'gsap';

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
    const GraphQl = new GraphQLService();

    const response = await GraphQl.getUserInfo();
    const xp_response = await GraphQl.getUserXP();
    const totalXP = xp_response.transaction.reduce((sum, t) => sum + t.amount, 0);
    let humanReadable_XP = totalXP >= 1000000 ? (totalXP / 1000000).toFixed(2) : 
                            totalXP >= 1000 ? (totalXP / 1000).toFixed(2) : totalXP.toFixed(2);
    console.log("readable: ", humanReadable_XP);

    const user = response.user[0];
    console.log('user: ', user);

    try {
        updateProfile(user, humanReadable_XP);
    } catch (error) {
        console.log('Error loading data: ', error);
    }
}

function updateProfile(user, humanReadable_XP) {
    document.getElementById('user-greeting').textContent = `Hello, ${user.attrs.firstName}`;
    document.getElementById('profile-name').textContent = `${user.login}`;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-xp').textContent = `${humanReadable_XP.toLocaleString()}` + ' XP';
    // document.getElementById('profile-projects').textContent = `${stats.projects.completed}/${stats.projects.total}`;
    // document.getElementById('profile-audit-ratio').textContent = stats.audits.ratio.toFixed(2);
}