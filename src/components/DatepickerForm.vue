<template>
    <form class="mb-4 flex space-x-2" @submit.prevent="onSubmit">
      <Datepicker v-model="localStartDate" placeholder="Start Date" class="p-2 border rounded" />
      <Datepicker v-model="localEndDate" placeholder="End Date" class="p-2 border rounded" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded sbt-btn">Submit</button>
    </form>
  </template>
  
  <script>
  import Datepicker from 'vue3-datepicker';
  
  export default {
    components: { Datepicker },
    props: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    data() {
      return {
        localStartDate: this.startDate,  // Create local copies of props
        localEndDate: this.endDate,      // Create local copies of props
      };
    },
    methods: {
      onSubmit() {
        // Emit the updated values to the parent
        this.$emit('submitDates', { startDate: this.localStartDate, endDate: this.localEndDate });
      },
    },
  };
  </script>
  