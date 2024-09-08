<template>
  <div class="space-y-4" v-if="stats">
    <p>
  <strong><i class="fas fa-meteor"></i> Fastest Asteroid:</strong> {{ stats.fastestAsteroid.id }} at {{ stats.fastestAsteroid.speed }} km/h
</p>
<p>
  <strong><i class="fas fa-ruler-horizontal"></i> Closest Asteroid:</strong> {{ stats.closestAsteroid.id }} at {{ stats.closestAsteroid.distance }} km
</p>
<p>
  <strong><i class="fas fa-weight"></i> Average Size:</strong> {{ stats.averageSize }} km
</p>

  </div>
</template>

<script>
export default {
  props: {
    stats: Object,
  },
};
</script>
