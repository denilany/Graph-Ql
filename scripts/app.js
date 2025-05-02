import { LoginUI } from "./pages/login.js";
import { Auth } from "./auth.js";
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const auth = new Auth();

    if (!auth.checkAuth()) {
        renderLoginPage();
        animateLoginElements();
        setupTogglePassword();

        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (event) => {
                handleLogin(auth, event);
            }
        );
    }
});

function handleLogin(auth, event) {
    event.preventDefault();

    const identity = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errDiv = document.getElementById('login-error');
    
    if (!identity || !password) {
        errDiv.textContent = "Login details cannot be empty";
        return;
    }

    const loginButton = document.querySelector('.login-btn');
    const originalButtonText = loginButton.textContent;
    loginButton.textContent = "Logging in...";
    loginButton.disabled = true;

    auth.login(identity, password);
    // if (!result) {
    //     console.log(result)
    //     errDiv.textContent = "Error logging in contact administrator";
    // }
    loginButton.textContent = originalButtonText;
    loginButton.disabled = false;
}

function renderLoginPage() {
    document.body.innerHTML = LoginUI.getTemplate();
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
