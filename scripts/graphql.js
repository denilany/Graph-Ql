export class GraphQLService {
    constructor(token) {
        this.endpoint = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';
        this.token = localStorage.getItem('auth_token') || null;
    }

    async query(queryString, variables = {}) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    query: queryString,
                    variables: variables
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            return data.data;
        } catch (error) {
            console.error('GraphQL query error:', error);
            throw error;
        }
    }

    // Get user basic info
    async getUserInfo() {
        const query = `
            {
                user {
                    id
                    login
                    email
                    attrs
                }
            }
        `;
        return this.query(query);
    }

    // Get user XP
    async getUserXP() {
        const query = `
            {
                transaction(
                    where: {
                        _and: [
                            { type: { _eq: "xp" } },
                            { eventId: { _eq: 75 } }
                        ]
                    }
                ) {
                    path
                    amount
                    type
                    createdAt
                }
            }
        `;
        return this.query(query);
    }

    // Get completed projects
    async getCompletedProjects() {
        const query = `
            pendingProgress: progress(
                where: {
                    isDone: { _eq: false },
                    eventId: { _eq: 75 },
                    id: { _neq: 145124 }
                }
            ) {
                createdAt
                path
            }
        `;
        return this.query(query);
    }

    // Get user audits
    async getUserAudits() {
        const query = `
            query {
                user {
                    id
                    auditsGiven: transactions_aggregate(where: {type: {_eq: "up"}, eventId: {_like: "%audit%"}}) {
                        aggregate {
                            count
                        }
                    }
                    auditsReceived: transactions_aggregate(where: {type: {_eq: "down"}, eventId: {_like: "%audit%"}}) {
                        aggregate {
                            count
                        }
                    }
                    auditsDone: audits {
                        id
                        grade
                        createdAt
                        object {
                            name
                        }
                    }
                    auditsReceivedDetails: audited {
                        id
                        grade
                        createdAt
                        object {
                            name
                        }
                    }
                }
            }
        `;
        return this.query(query);
    }

    // Get user skills
    async getUserSkills() {
        const query = `
            query {
                user {
                    id
                    transactions(where: {type: {_eq: "skill"}}) {
                        id
                        amount
                        object {
                            id
                            name
                        }
                    }
                }
            }
        `;
        return this.query(query);
    }

    // Get project pass/fail ratio
    async getProjectRatio() {
        const query = `
            query {
                user {
                    id
                    passedProjects: progresses_aggregate(where: {isDone: {_eq: true}, grade: {_gte: 1}}) {
                        aggregate {
                            count
                        }
                    }
                    failedProjects: progresses_aggregate(where: {isDone: {_eq: true}, grade: {_eq: 0}}) {
                        aggregate {
                            count
                        }
                    }
                }
            }
        `;
        return this.query(query);
    }
}