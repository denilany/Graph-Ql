const AUTH_URL = 'https://learn.zone01kisumu.ke/api/auth/signin';
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_ID_KEY = 'auth_user_id';

export class Auth {
    constructor () {
        this.token = localStorage.getItem(AUTH_TOKEN_KEY) || null;
        this.userId = localStorage.getItem(AUTH_USER_ID_KEY) || null;
        this.isAuthenticated = !!this.token;
    }

    async login(identity, password, errDiv) {
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
                const errorData = response.json();
                throw new Error(errorData.error || "Invalid Credentials");
            }

            const token = response.json();
            this.token = token;

            localStorage.setItem(AUTH_TOKEN_KEY, this.token);

            this.userId = this._ParseUserId(this.token, errDiv);
            localStorage.setItem(AUTH_USER_ID_KEY, this.userId);

            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error('Login error:', error);
            errDiv.textcontent = 'Error logging in contact administrator';
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

    _ParseUserId(token, errDiv) {
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                throw new Error('Invalid token format');
            }

            const payload = JSON.parse(atob(tokenParts[1]));
            return payload.sub;
        } catch (error) {
            console.log('Error parsing JWT:', error);
            errDiv.textcontent = 'Error logging in contact administrator';
            return null;
        }
    }
}

// function stripTags(input) {
//     return input.replace(/<\/?[^>]+(>|$)/g, "");
// }
  