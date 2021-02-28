<template>
  <q-page class="flex flex-center">
    <div>
      <apexchart width="1000" type="line" :options="options" :series="series"></apexchart>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Reports',
  data () {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
        }
      },
      series: [{
        name: 'участки',
        data: [30, 40, 45, 50, 49, 60, 70, 10]
      }]
    }
  }
}
</script>
