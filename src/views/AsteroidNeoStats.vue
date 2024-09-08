<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Asteroid Neo Stats</h1>
    <p class="text-red-500" v-if="showWarning">
      Please select a date range within 7 days. The NEO API limits the range due to the dynamic nature of asteroid trajectories.
    </p>

    <!-- Datepicker Form -->
    <DatepickerForm
      :startDate="startDate"
      :endDate="endDate"
      @submitDates="fetchData"
    />

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center">
      <LoadingSpinner />
    </div>

    <!-- Asteroid Stats -->
    <AsteroidStats v-if="!isLoading && stats" :stats="stats" />

    <!-- Asteroid Chart -->
    <AsteroidChart v-if="!isLoading && asteroids" :asteroids="asteroids" />
  </div>
</template>

<script>
import DatepickerForm from '../components/DatepickerForm.vue';
import AsteroidStats from '../components/AsteroidStats.vue';
import AsteroidChart from '../components/AsteroidChart.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { getAsteroidData } from '@/services/nasaApi';

export default {
  components: {
    DatepickerForm,
    AsteroidStats,
    AsteroidChart,
    LoadingSpinner,
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      stats: null,
      asteroids: null,
      isLoading: false,  // Loading state
      showModal: false,  // Control modal visibility
      showWarning: false,  // Control warning message visibility
    };
  },
  methods: {
    async fetchData({ startDate, endDate }) {
      if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
      }

      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      // Check if the date range is more than 7 days
      const diffDays = this.getDateDiff(startDate, endDate);
      if (diffDays > 7) {
        this.showModal = true;  // Show the modal
        this.showWarning = true;  // Show the warning message under the title
        return;
      }

      this.isLoading = true;

      try {
        const response = await getAsteroidData(formattedStartDate, formattedEndDate);
        this.processData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    getDateDiff(startDate, endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },


    processData(data) {
      const asteroids = data.near_earth_objects;
      this.asteroids = asteroids;
      this.stats = this.calculateStats(asteroids);
    },

    calculateStats(asteroids) {
      let fastestAsteroid = null;
      let closestAsteroid = null;
      let totalSize = 0;
      let count = 0;

      Object.values(asteroids).forEach((dayAsteroids) => {
        dayAsteroids.forEach((asteroid) => {
          const speed = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;
          const distance = asteroid.close_approach_data[0].miss_distance.kilometers;
          const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max;

          if (!fastestAsteroid || speed > fastestAsteroid.speed) {
            fastestAsteroid = { id: asteroid.id, speed };
          }
          if (!closestAsteroid || distance < closestAsteroid.distance) {
            closestAsteroid = { id: asteroid.id, distance };
          }
          totalSize += size;
          count++;
        });
      });

      return {
        fastestAsteroid,
        closestAsteroid,
        averageSize: (totalSize / count).toFixed(2),
      };
    },
  },
};
</script>
<style>
/* General styles */
body {
  font-family: 'Poppins', sans-serif;
  background: #121212;
  color: #f0f0f0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container Styling */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h1 {
  color: #f9f9f9;
  text-align: center;
  font-size: 2.5rem;
  animation: galaxy-fadein 1.5s ease-in-out;
}

/* Galaxy animation */
@keyframes galaxy-fadein {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Responsive form */
form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

form input,
form button {
  padding: 10px 15px;
  margin: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #fff;
  outline: none;
}

form button {
  background-color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #2980b9;
}

/* Text Content */
p {
  font-size: 1.1rem;
  line-height: 1.5;
  text-align: center;
}

strong {
  color: #00d9ff;
}

/* Chart Styling */
canvas {
  max-width: 100%;
  margin-top: 30px;
  border-radius: 10px;
  background-color: #1c1c1c;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Loader Styling */
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8); /* Dark overlay */
  z-index: 9999;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #f18329;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive media queries */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  form input,
  form button {
    width: 100%;
  }

  p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  form{
    margin-right: 3rem;
  }

  form input,
  form button {
    padding: 8px 12px;
  }
.sbt-btn{
  width: 15.3rem;
    margin-left: 3.3rem;
}
  p {
    font-size: 0.9rem;
  }
}

</style>