import { LoginUI } from "./pages/login.js";
import { Auth } from "./auth.js";
import { gsap } from 'gsap';
import * as Dashboard from './dashboard.js';
import { GraphQLService } from './graphql.js';

const GraphQl = new GraphQLService();

document.addEventListener('DOMContentLoaded', async () => {
    const auth = new Auth();

    if (!auth.checkAuth()) {
        renderLoginPage();
        animateLoginElements();
        setupTogglePassword();

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                await handleLogin(auth, event);
            });
        }
    } else {
        Dashboard.switchToDashboard();

        Dashboard.loadUserData();

        // Set dashboard navigation
        const navItems = document.querySelectorAll('.sidebar-nav li');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                item.classList.add('active');
                
                const sectionId = item.getAttribute('data-section');
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${sectionId}-section`).classList.add('active');
            });
        });

        // Hamburger menu toggle for mobile
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const sidebarNav = document.querySelector('.sidebar-nav');

        hamburgerMenu.addEventListener('click', () => {
            sidebarNav.classList.toggle('open');
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.logout();
            renderLoginPage();
        });

        const userResponse = await GraphQl.getUserInfo();

        // console.log("response: ", userResponse.transaction);

        document.getElementById("graph-selector").addEventListener('change', function (e) {
            const selectedValue = e.target.value;
            Dashboard.updateGraph(selectedValue, userResponse);
            // console.log("Selected value:", selectedValue);
        });

        Dashboard.updateGraph('xp-progress', userResponse);
    }    
});

async function handleLogin(auth, event) {
    event.preventDefault();

    const identity = document.getElementById('username')?.value?.trim();
    const password = document.getElementById('password')?.value?.trim();
    const errDiv = document.getElementById('login-error');

    if (!identity || !password) {
        if (errDiv) errDiv.textContent = "Login details cannot be empty";
        return;
    }

    const loginButton = document.querySelector('.login-btn');
    const originalButtonText = loginButton?.textContent;

    if (loginButton) {
        loginButton.textContent = "Logging in...";
        loginButton.disabled = true;
    }

    try {
        const success = await auth.login(identity, password);

        if (success) {
            Dashboard.switchToDashboard();
            location.reload();
            console.log("Login successful");
        } else {
            if (errDiv) errDiv.textContent = "Login failed. Please try again.";
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        if (errDiv) errDiv.textContent = err.message || "Unexpected error";
    } finally {
        if (loginButton) {
            loginButton.textContent = originalButtonText;
            loginButton.disabled = false;
        }
    }
}

function renderLoginPage() {
    document.body.innerHTML = LoginUI.getTemplate();
    // Clear inputs
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
}

function animateLoginElements() {
    gsap.from('.login-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.login-header, .input-group, .remember-forgot, .login-btn', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out'
    });
}

function setupTogglePassword() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (!togglePassword || !passwordInput) return;

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}
