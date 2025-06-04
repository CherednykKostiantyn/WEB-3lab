<template>
  <main class="container d-flex flex-column justify-content-center align-items-center text-center" style="min-height: calc(100vh - 120px); padding-top: 60px; padding-bottom: 60px;">
    <div class="row align-items-center">
      <div class="col-12 col-md-6">
        <h1 class="fw-bold">Готові висловити свою думку?</h1>
        <p class="lead">Тоді вам на Questify. Ваша думка важлива! Приєднуйтесь до захоплюючих опитувань.</p>
        <div class="d-flex justify-content-center gap-3 mt-3">
          <router-link to="/login" class="btn btn-secondary btn-lg">Sign In</router-link>
          <router-link to="/register" class="btn btn-primary btn-lg">Sign Up</router-link>
        </div>
      </div>
      <div class="col-12 col-md-6 mt-3">
        <img :src="logo" alt="Questify Logo" class="img-fluid" style="max-width: 350px;" />
      </div>
    </div>
  </main>
</template>

<script>
import logo from '@/assets/logo.png';

export default {
  name: 'Home',
  data() {
    return {
      logo
    };
  }
};
</script>
