import { Dashboard } from "./pages/dashboard.js"
import { GraphQLService } from './graphql.js';
import { gsap } from 'gsap';

const GraphQl = new GraphQLService();

async function getUserData() {
    try {
        const userResponse = await GraphQl.getUserInfo();

        if (
            !userResponse ||
            !Array.isArray(userResponse.user) ||
            userResponse.user.length === 0 ||
            !Array.isArray(userResponse.transaction)
        ) {
            throw new Error("Invalid user response");
        }

        const user = userResponse.user[0];
        const transactions = userResponse.transaction;

        const attrs = typeof user.attrs === 'string' ? JSON.parse(user.attrs) : user.attrs;

        const allXp = transactions
            .filter((t) => t.type === "xp")
            .reduce((sum, t) => sum + t.amount, 0);


        const done = transactions
            .filter((t) => t.type === "up")
            .reduce((sum, t) => sum + t.amount, 0);

        const received = transactions
            .filter((t) => t.type === "down")
            .reduce((sum, t) => sum + t.amount, 0);
        
        // console.log("Birth: ", attrs?.dateOfBirth);

        return {
            id: user.id,
            login: user.login,
            email: user.email,
            auditRatio: user.auditRatio,
            firstName: attrs?.firstName || "Unknown",
            allXp,
            done,
            received,
            transaction: transactions
        };
    } catch (error) {
        console.error("Failed to fetch audit stats: ", error);
        return {
            id: null,
            login: null,
            email: null,
            auditRatio: null,
            firstName: null,
            done: 0,
            received: 0,
            transaction: []
        };
    }
}

async function completedProjects() {
    try {
        const projectsResponse = await GraphQl.getCompletedProjects();

        if (!projectsResponse) {
            throw new Error("Invalid response format: ", projectsResponse.message);
        }

        return projectsResponse.pendingProgress.length.toString();

    } catch (error) {
        console.error("Failed to fetch completed projects: ", error);
        return "0";
    }
}

async function totalXP() {
    try {
        const xp_response = await GraphQl.getUserXP();

        if (!xp_response || !Array.isArray(xp_response.transaction)) {
            throw new Error("Invalid response format: ", xp_response.message);
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

async function updateAudits(auditStats) {
    // totalXPInBytes ? (totalXPreceived/1000/1000).toFixed(1) : "0.0";
    document.getElementById('audits-given').textContent = auditStats.allXp ? (auditStats.received/1000/1000).toFixed(1) : 0.0;
    document.getElementById('audits-received').textContent = auditStats.done ? (auditStats.done/1000/1000).toFixed(1) : 0.0;
    document.getElementById('audits-ratio').textContent = auditStats.auditRatio.toFixed(1);
    
    // const tableBody = document.getElementById('audits-table-body');
    // tableBody.innerHTML = '';
    
    // audits.forEach(audit => {
    //     const row = document.createElement('tr');
        
    //     row.innerHTML = `
    //         <td>${audit.project}</td>
    //         <td>${audit.type}</td>
    //         <td>${audit.grade}/5</td>
    //         <td>${formatDate(audit.date)}</td>
    //     `;
        
    //     tableBody.appendChild(row);
    // });
}

function updateGraph(graphType) {
    const svg = d3.select('#stats-graph');
    svg.selectAll('*').remove();
    
    const width = svg.node().getBoundingClientRect().width;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
    switch (graphType) {
        case 'xp-progress':
            createLineChart(g, mockData.stats.xpProgress, innerWidth, innerHeight);
            break;
        case 'project-xp':
            createBarChart(g, mockData.stats.projectXP, innerWidth, innerHeight);
            break;
        case 'audit-ratio':
            createPieChart(g, mockData.stats.audits, innerWidth, innerHeight);
            break;
        case 'project-ratio':
            createDonutChart(g, mockData.stats.projects, innerWidth, innerHeight);
            break;
    }
}

export async function loadUserData() {
    const humanReadable_XP = await totalXP();
    const projectStats = await completedProjects();

    const stats = {
        "xp": humanReadable_XP,
        "projects": projectStats,
    }

    const userData = await getUserData();
    const skills = await GraphQl.getUserSkills();

    try {
        await updateProfile(stats, userData);
        await updateAudits(userData);
        await updateSkillsChart(skills);
    } catch (error) {
        console.log('Error loading data: ', error);
    }
}

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

// update user profile page
async function updateProfile(stats, userData) {
    document.getElementById('user-greeting').textContent = `Hello, ${userData.firstName}`;
    document.getElementById('profile-name').textContent = `${userData.login}`;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-xp').textContent = `${stats.xp}`;
    document.getElementById('profile-projects').textContent = `${stats.projects}`;
    document.getElementById('profile-audit-ratio').textContent = userData.auditRatio.toFixed(1);
}

// Update skills chart
function updateSkillsChart(userData) {
    console.log("userdata: ", userData);

    const skillsChart = document.getElementById("skills-chart");
    const skills = userData.user[0].skills;

    if (!skills || skills.length === 0) {
        skillsChart.innerHTML = "<p>No skills data available yet</p>";
        return;
    }

    // 1. Extract highest amount per skill type
    const highestSkillsMap = new Map();
    for (const skill of skills) {
        const existing = highestSkillsMap.get(skill.type);
        if (!existing || skill.amount > existing.amount) {
            highestSkillsMap.set(skill.type, skill);
        }
    }

    const uniqueMaxSkills = Array.from(highestSkillsMap.values());

    // 2. Group by category ("skill_prog" → "prog")
    const groupedSkills = uniqueMaxSkills.reduce((acc, skill) => {
        const category = skill.type.replace("skill_", "");
        if (!acc[category]) {
            acc[category] = {
                amount: 0,
                skills: [],
            };
        }
        acc[category].amount += skill.amount;
        acc[category].skills.push(skill);
        return acc;
    }, {});

    skillsChart.innerHTML = '';

    // 3. Render each skill group
    Object.entries(groupedSkills)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .forEach(([category, data]) => {
            const skillCategoryContainer = document.createElement('div');
            skillCategoryContainer.className = 'skill-category';

            const categoryLabel = document.createElement('div');
            categoryLabel.className = 'skill-label';
            categoryLabel.innerHTML = `
                <span class="skill-name">${category.toUpperCase()}</span>
                <span class="skill-value">${data.amount}%</span>
            `;

            const skillProgressBar = document.createElement('div');
            skillProgressBar.className = 'skill-bar';

            const skillProgress = document.createElement('div');
            skillProgress.className = 'skill-progress';
            skillProgress.style.width = '0%';

            skillProgressBar.appendChild(skillProgress);
            skillCategoryContainer.appendChild(categoryLabel);
            skillCategoryContainer.appendChild(skillProgressBar);
            skillsChart.appendChild(skillCategoryContainer);

            setTimeout(() => {
                skillProgress.style.width = `${data.amount}%`;
            }, 300);
        });
}

