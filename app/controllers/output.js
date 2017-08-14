import Ember from 'ember';

export default Ember.Controller.extend({

  chartData: Ember.computed('model', function() {
    return {
      labels: xlength,
      datasets: [{
        label: 'combination 1',
        data: nodeVoltages,
        borderColor: '#0d62ff',
      }]
    }
  }),
  chartOptions: {
    responsive: true
  }
});
