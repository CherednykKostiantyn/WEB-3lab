<template>
  <div class="app-container">
    <header class="header bg-dark text-white py-2" id="navbar-container">
      <div class="logo-container">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img :src="logo" alt="Questify Logo" class="logo" />
          <span class="site-title">Questify</span>
        </router-link>
      </div>
      <nav class="nav-links d-flex align-items-center">
        <router-link to="/login" class="nav-link text-white">Login</router-link>
        <router-link to="/register" class="nav-link text-white">Register</router-link>
        <router-link to="/profile" class="nav-link text-white">Profile</router-link>
        <router-link to="/quiz" class="nav-link text-white">Quiz</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer class="footer bg-dark text-white text-center py-2" id="footer-container">
     <p>© 2025 Questify. All rights reserved. Contact us: <a href="mailto:cherednyk.kostiantyn@lll.kpi.ua" class="text-white">cherednyk.kostiantyn@lll.kpi.ua</a></p>
    </footer>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';

export default {
  name: 'App',
  data() {
    return {
      logo
    };
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  min-height: 60px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  margin-right: 10px;
}

.site-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-links .nav-link {
  margin-left: 15px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-links .router-link-active {
  background-color: #C71585;
  color: white !important;
}

.nav-links .nav-link:hover {
  background-color: #FF69B4;
  color: white !important;
}

main {
  flex: 1;
}

.footer {
  padding: 10px 0;
  min-height: 40px;
}
</style>