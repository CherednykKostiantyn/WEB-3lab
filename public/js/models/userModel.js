class UserModel {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  async register(userData) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  }

  async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    this.currentUser = result.user;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async addSurvey(surveyData) {
    if (!this.currentUser) {
      throw new Error('No current user');
    }
    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUser.id, ...surveyData })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
  }

  async hasUserAnsweredQuestion(question) {
    if (!this.currentUser) return false;
    const response = await fetch(`/api/profile/${this.currentUser.id}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result.surveys.some(survey => survey.question === question);
  }
}