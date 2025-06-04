<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-sm-12">
        <div class="card">
          <div class="card-body p-3 border rounded bg-light d-flex flex-column flex-md-row align-items-center text-center text-md-start">
            <img src="@/assets/avatar.png"
                 alt="Avatar Image"
                 class="rounded-circle img-fluid me-md-3 mb-3 mb-md-0"
                 style="width: 250px; height: 250px; object-fit: cover;"
                 @error="setDefaultAvatar">
            <div class="flex-grow-1">
              <h5 class="mb-3">Ваш профіль</h5>

              <form @submit.prevent="updateProfile">
                <table class="table table-sm profile-table">
                  <tbody>
                    <tr v-for="(label, key) in displayFields" :key="key">
                      <th>{{ label }}</th>
                      <td>
                        <span v-if="!isEditing">{{ displayValue(key) }}</span>
                        <input
                          v-else-if="key !== 'gender'"
                          v-model="user[key]"
                          :type="inputType(key)"
                          class="form-control form-control-sm"
                          :required="key === 'email' || key === 'phone_number' || key === 'date_of_birth'"
                        />
                        <select v-else v-model="user.gender" class="form-control form-control-sm">
                          <option value="">Не вказано</option>
                          <option value="male">Чоловік</option>
                          <option value="female">Жінка</option>
                          <option value="other">Інше</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-3" v-if="isEditing">
                  <button type="submit" class="btn btn-success me-2"><i class="bi bi-check-lg"></i> Зберегти</button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Скасувати</button>
                </div>
              </form>

              <div v-if="!isEditing" class="mt-3">
                <button class="btn btn-primary me-2" @click="startEdit"><i class="bi bi-pencil"></i> Редагувати профіль</button>
                <button class="btn btn-primary" @click="logout">Вийти</button>
              </div>

              <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>

              <div id="surveysContainer" class="mt-4">
                <h6>Пройдені опитування</h6>
                <div v-if="completedSurveys.length > 0">
                  <div v-for="survey in completedSurveys" :key="survey.surveyId" class="mb-2 p-2 border rounded">
                    <p class="mb-1"><strong>Питання:</strong> {{ survey.question }}</p>
                    <p class="mb-1"><strong>Ваша відповідь:</strong> {{ survey.answer }}</p>
                  </div>
                </div>
                <p v-else>Ви ще не пройшли жодного опитування.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      originalUser: null,
      error: '',
      isEditing: false,
      defaultAvatar: 'https://via.placeholder.com/250',
      completedSurveys: [],
      displayFields: {
        surname: 'Прізвище',
        firstName: "Ім'я",
        middleName: 'По батькові',
        email: 'Email',
        phone_number: 'Номер телефону',
        gender: 'Стать',
        date_of_birth: 'Дата народження'
      }
    };
  },
  async created() {
    await this.fetchUser();
    this.loadCompletedSurveys();
    const savedUser = JSON.parse(localStorage.getItem('userProfile'));
    if (savedUser) {
      this.user = { ...savedUser };
      this.originalUser = { ...savedUser };
    }
  },
  methods: {
    async fetchUser() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('No userId found. Please login again.');
        const response = await fetch(`http://localhost:3000/api/profile/${userId}`);
        const data = await response.json();
        if (!response.ok || !data.user) throw new Error(data.error || 'Failed to fetch user');
        this.user = { ...data.user };
        this.originalUser = { ...data.user };
        localStorage.setItem('userProfile', JSON.stringify(this.user));
      } catch (err) {
        this.error = err.message;
        setTimeout(() => this.$router.push('/login'), 1500);
      }
    },
    async updateProfile() {
      try {
        const userId = localStorage.getItem('userId');
        const payload = {
          email: this.user.email,
          password: this.user.password || undefined,
          date_of_birth: this.user.date_of_birth,
          phone_number: this.user.phone_number,
          surname: this.user.surname || '',
          firstName: this.user.firstName || '',
          middleName: this.user.middleName || '',
          gender: this.user.gender || ''
        };
        const response = await fetch(`http://localhost:3000/api/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Не вдалося оновити профіль');
        this.error = 'Профіль оновлено!';
        this.isEditing = false;
        this.originalUser = { ...this.user };
        localStorage.setItem('userProfile', JSON.stringify(this.user));
      } catch (err) {
        this.error = err.message;
      }
    },
    startEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.user = { ...this.originalUser };
      this.error = '';
    },
    logout() {
      localStorage.removeItem('userId');
      localStorage.removeItem('userProfile');
      this.$router.push('/login');
    },
    setDefaultAvatar(event) {
      event.target.src = this.defaultAvatar;
    },
    displayValue(key) {
      if (key === 'gender') return this.genderLabel(this.user[key]);
      return this.user[key] || 'Not set';
    },
    genderLabel(g) {
      switch (g) {
        case 'male': return 'Чоловік';
        case 'female': return 'Жінка';
        case 'other': return 'Інше';
        default: return 'Не вказано';
      }
    },
    inputType(key) {
      if (key === 'email') return 'email';
      if (key === 'date_of_birth') return 'date';
      if (key === 'phone_number') return 'tel';
      return 'text';
    },
    loadCompletedSurveys() {
      const userId = localStorage.getItem('userId');
      const responses = JSON.parse(localStorage.getItem(`surveyResponses_${userId}`)) || [];
      this.completedSurveys = responses;
    }
  }
};
</script>

<style scoped>
.card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
}
.table th {
  width: 40%;
}
.form-control-sm {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}
.btn-primary {
  background-color: #007bff;
  border: none;
}
.btn-primary:hover {
  background-color: #0056b3;
}
</style>
