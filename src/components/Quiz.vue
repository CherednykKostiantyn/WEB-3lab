<template>
  <div class="container">
    <h2 class="mb-4">Актуальні опитування</h2>
    <div v-if="surveys.length > 0">
      <div v-for="survey in paginatedSurveys" :key="survey.id" class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">{{ survey.question }}</h5>
          <form v-if="!isSurveyCompleted(survey.id)" @submit.prevent="submitSurvey(survey.id, survey.question)">
            <div v-for="(option, index) in survey.options" :key="index" class="form-check">
              <input
                class="form-check-input"
                type="radio"
                :name="'survey-' + survey.id"
                :id="'option-' + survey.id + '-' + index"
                :value="option"
                v-model="selectedOptions[survey.id]"
                required
              />
              <label class="form-check-label" :for="'option-' + survey.id + '-' + index">
                {{ option }}
              </label>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Голосувати</button>
          </form>
          <p v-else class="text-success">Ви вже відповіли на це опитування.</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Немає доступних опитувань.</p>
    </div>

    <nav class="mt-3">
      <ul class="pagination pagination-sm justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a href="#" class="page-link" @click.prevent="changePage(currentPage - 1)">Попередня</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a href="#" class="page-link" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a href="#" class="page-link" @click.prevent="changePage(currentPage + 1)">Наступна</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      surveys: [
        {
          id: 1,
          question: "Яка ваша улюблена соціальна мережа?",
          options: ["Facebook", "Instagram", "Twitter"]
        },
        {
          id: 2,
          question: "Який ваш улюблений мобільний бренд?",
          options: ["Apple", "Samsung", "Xiaomi"]
        },
        {
          id: 3,
          question: "Яка ваша улюблена мова програмування?",
          options: ["C++", "Python", "JavaScript"]
        }
      ],
      selectedOptions: {},
      currentPage: 1,
      surveysPerPage: 2,
      totalPages: 1,
      error: ''
    };
  },
  created() {
    this.calculatePagination();
  },
  methods: {
    calculatePagination() {
      this.totalPages = Math.ceil(this.surveys.length / this.surveysPerPage);
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    submitSurvey(surveyId, question) {
      try {
        const selectedOption = this.selectedOptions[surveyId];
        if (!selectedOption) {
          throw new Error('Будь ласка, виберіть одну з опцій.');
        }
        const userId = localStorage.getItem('userId');
        const responses = JSON.parse(localStorage.getItem(`surveyResponses_${userId}`)) || [];
        if (responses.some(r => r.surveyId === surveyId)) {
          throw new Error('Ви вже відповіли на це опитування.');
        }
        responses.push({
          surveyId,
          question,
          answer: selectedOption,
          date: new Date().toISOString()
        });
        localStorage.setItem(`surveyResponses_${userId}`, JSON.stringify(responses));
        alert(`Ви проголосували за "${selectedOption}" у опитуванні ${surveyId}!`);
        this.selectedOptions[surveyId] = null;
      } catch (err) {
        this.error = err.message;
      }
    },
    isSurveyCompleted(surveyId) {
      const userId = localStorage.getItem('userId');
      const responses = JSON.parse(localStorage.getItem(`surveyResponses_${userId}`)) || [];
      return responses.some(r => r.surveyId === surveyId);
    }
  },
  computed: {
    paginatedSurveys() {
      const start = (this.currentPage - 1) * this.surveysPerPage;
      const end = start + this.surveysPerPage;
      return this.surveys.slice(start, end);
    }
  }
};
</script>

<style scoped>
.card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
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
</style>