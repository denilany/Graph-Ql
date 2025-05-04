const AUTH_URL = 'https://learn.zone01kisumu.ke/api/auth/signin';
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_ID_KEY = 'auth_user_id';

export class Auth {
    constructor () {
        this.token = localStorage.getItem(AUTH_TOKEN_KEY) || null;
        this.userId = localStorage.getItem(AUTH_USER_ID_KEY) || null;
        this.isAuthenticated = !!this.token;
    }

    async login(identity, password) {
        
        try {
            const credentials = btoa(`${identity}:${password}`);

            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                throw new Error(errorData.error || "Invalid Credentials");
            }

            const token = await response.json();

            const userId = this._ParseUserId(token);
            if (!userId) {
                console.error('Invalid token: could not extract user ID');
                throw new Error('Error logging in contact administrator');
            }


            this.token = token;
            this.userId = userId;
            this.isAuthenticated = true;

            localStorage.setItem(AUTH_TOKEN_KEY, this.token);
            localStorage.setItem(AUTH_USER_ID_KEY, this.userId);

            return true;
        } catch (error) {
            this.errMsg(error.message || "Invalid login credentials");
            console.error('Login error:', error);
            return false;
        }
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_ID_KEY);
    }

    checkAuth() {
        return this.isAuthenticated;
    }

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userId;
    }

    _ParseUserId(token) {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Invalid token format');
            return null;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        if (!payload.sub) {
            console.error('Token does not contain user ID (sub)');
            return null;
        }

        return payload.sub;
    }

    errMsg(message) {
        const errMsg = document.getElementById('login-error');
        errMsg.style.display = 'block';
        console.log(message);
        errMsg.textContent = message;
    }
}
  