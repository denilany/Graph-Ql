export class LoginUI {
    static getTemplate() {
        return `
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <img src="assets/logo.png" alt="Dashboard Logo" class="logo">
                    <h1>Hello Apprentice</h1>
                    <p>Welcome back</p>
                </div>
                <div id="login-error" class="error-message"></div>
                <form id="login-form">
                    <div class="input-group">
                        <div class="input-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <input type="text" id="username" placeholder="Username or Email" required>
                    </div>
                    <div class="input-group">
                        <div class="input-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <input type="password" id="password" placeholder="Password" required>
                        <div class="toggle-password">
                            <i class="fas fa-eye"></i>
                        </div>
                    </div>
                    <div class="remember-forgot">
                        <div class="remember">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Remember me</label>
                        </div>
                    </div>
                    <button type="submit" class="login-btn">Login</button>
                </form>
            </div>
        </div>
        `;
    }
}