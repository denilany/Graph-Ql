import { LoginUI } from "./pages/login.js";
import { Auth } from "./auth.js";
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const auth = new Auth();

    if (!auth.checkAuth()) {
        document.body.innerHTML = LoginUI.getTemplate();

        const app = document.querySelector('.app');

        // Animation for login card
        gsap.from('.login-card', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animations for form elements with staggered delay
        gsap.from('.login-header, .input-group, .remember-forgot, .login-btn, .login-footer', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out'
        });

        // Toggle password visibility
        const togglePassword = document.querySelector('.toggle-password');
        const passwordInput = document.getElementById('password');

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            togglePassword.querySelector('i').classList.toggle('fa-eye');
            togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
});