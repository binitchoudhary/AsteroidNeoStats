<template>
    <canvas id="asteroidChart" class="mt-8"></canvas>
  </template>
  
  <script>
  import { nextTick } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    props: {
      asteroids: Object,
    },
    data() {
      return {
        asteroidChart: null,
      };
    },
    watch: {
      asteroids: {
        immediate: true,
        handler(newData) {
          if (newData) {
            this.renderChart(newData);
          }
        },
      },
    },
    methods: {
      renderChart(asteroids) {
        const labels = Object.keys(asteroids);
        const data = labels.map((date) => asteroids[date].length);
  
        nextTick(() => {
          if (this.asteroidChart) {
            this.asteroidChart.destroy(); // Destroy old chart instance
          }
          const ctx = document.getElementById('asteroidChart').getContext('2d');
          this.asteroidChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Number of Asteroids',
                  data,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        });
      },
    },
  };
  </script>
  