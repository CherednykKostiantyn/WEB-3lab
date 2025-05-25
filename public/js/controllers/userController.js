class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    window.addEventListener('load', () => {
      const currentPage = window.location.pathname.split('/').pop().toLowerCase();
      if (currentPage === 'quiz.html') {
        this.handleQuizSubmit();
      }
    });
  }

  init() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'register.html') {
      this.view.handleRegister(this.handleRegister.bind(this));
    } else if (currentPage === 'login.html') {
      this.view.handleLogin(this.handleLogin.bind(this));
    } else if (currentPage === 'profile.html') {
      const currentUser = this.model.getCurrentUser();
      if (!currentUser) {
        window.location.href = 'login.html';
        return;
      }
      this.fetchProfile(currentUser);
      this.view.handleLogout(this.handleLogout.bind(this));
      this.view.handleEdit = this.handleEdit.bind(this);
    }
  }

  async handleRegister(formData) {
    try {
      await this.model.register(formData);
      alert('Registration successful! Please sign in.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(error.message);
    }
  }

  async handleLogin(email, password) {
    try {
      await this.model.login(email, password);
      window.location.href = 'profile.html';
    } catch (error) {
      alert(error.message);
    }
  }

  handleLogout() {
    this.model.logout();
    window.location.href = 'index.html';
  }

  async fetchProfile(user) {
    try {
      const response = await fetch(`/api/profile/${user.id}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error);
      }
      this.view.renderProfile(result.user, result.surveys);
    } catch (error) {
      alert('Error fetching profile: ' + error.message);
    }
  }

  async handleEdit(updatedData, user) {
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error);
      }
      this.model.currentUser = { ...this.model.currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(this.model.currentUser));
      alert('Profile updated successfully!');
      await this.fetchProfile(this.model.getCurrentUser());
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  }

  handleQuizSubmit() {
    if (!this.model.getCurrentUser()) {
      alert('Будь ласка, увійдіть, щоб пройти опитування!');
      window.location.href = 'login.html';
      return;
    }

    const forms = [
      { id: 'surveyForm1', question: 'Яка ваша улюблена соціальна мережа?', name: 'survey1' },
      { id: 'surveyForm2', question: 'Який ваш улюблений мобільний бренд?', name: 'survey2' },
      { id: 'surveyForm3', question: 'Яка ваша улюблена мова програмування?', name: 'survey3' }
    ];

    forms.forEach(form => {
      const quizForm = document.getElementById(form.id);
      if (quizForm) {
        quizForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const answer = quizForm.querySelector(`input[name="${form.name}"]:checked`)?.value;
          if (answer) {
            const surveyData = { question: form.question, answer };
            try {
              const hasAnswered = await this.model.hasUserAnsweredQuestion(form.question);
              if (hasAnswered) {
                alert('Ви вже пройшли це опитування!');
                return;
              }
              await this.model.addSurvey(surveyData);
              alert('Опитування пройдено успішно!');
            } catch (error) {
              alert('Помилка при збереженні опитування: ' + error.message);
            }
          } else {
            alert('Будь ласка, оберіть відповідь!');
          }
        });
      }
    });
  }
}