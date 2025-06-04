<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-lg" style="max-width: 500px; width: 100%;">
      <h2 class="text-center mb-4">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="dateOfBirth" class="form-label">Date of Birth:</label>
          <input v-model="dateOfBirth" type="date" id="dateOfBirth" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Phone Number:</label>
          <input v-model="phoneNumber" type="tel" id="phoneNumber" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      dateOfBirth: '',
      phoneNumber: '',
      error: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            dateOfBirth: this.dateOfBirth,
            phoneNumber: this.phoneNumber
          })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        this.$router.push('/login');
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
.card {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.form-label {
  font-weight: bold;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.min-vh-100 {
  min-height: calc(100vh - 100px);
  padding-top: 60px;
  padding-bottom: 60px;
}
</style>