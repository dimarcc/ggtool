import Ember from 'ember';
import math from 'npm:mathjs';

export default Ember.Controller.extend({

//initializing the text box variable that needs to start out as null

  actions: {

    calculated: false,

    numfixS:null,
    psuS:null,
    ldrS:null,
    jmpS:null,
    wpxS:null,

    init() {
      this._super(...arguments);
      //console.log('controller init function');
      this.set('numfixS',null);
      this.set('psuS',null);
      this.set('ldrS',null);
      this.set('jmpS',null);
      this.set('wpxS',null);
    },

//onClick command for calculate button

    calculateValue() {

      this.set('calculated',true);

//checking for and defining static variables for the calculation

      var supplyPower = this.get('psuS').get('supplyPower'); //PT *corresponds with matlab code*
      //console.log(supplyPower);
      var supplyVoltage = this.get('psuS').get('supplyVoltage'); //VS
      //console.log(supplyVoltage);
      var ldrIntRes = this.get('ldrS').get('ldrIntRes'); //RL
      //console.log(ldrIntRes);
      var jmpIntRes = this.get('jmpS').get('jmpIntRes'); //RJ
      //console.log(jmpIntRes);
      var wpxIntRes = this.get('wpxS').get('wpxIntRes'); //RI
      //console.log(wpxIntRes);
      var wpxPower = this.get('wpxS').get('wpxPower'); //P0
      //console.log(wpxPower);
      var numfix = this.get('numfixS');  //N
      //console.log(numfix);

//using for loop function to create result array for graphing

      var results = calc(supplyVoltage,ldrIntRes,jmpIntRes,wpxIntRes,wpxPower,numfix);
      //console.log(results);

      var canvas = document.getElementById('resultChart');
      var chartData = {
          labels: results.xlength,
          datasets: [
              {
                  label: 'Voltage [V]',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "#486dff",
                  borderColor: "#486dff",
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 5,
                  pointHitRadius: 10,
                  data: results.nodeVoltages,
              }
          ]
      };

      var chartOptions = {
      	showLines: true,
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Number of Fixtures'
            },
            ticks: {
              callback: function(value, index, values) {
                return '#' + value;
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Voltage [V]'
            }
          }]
        }
      };

      var resultChart = Chart.Line(canvas,{
      	data:chartData,
        options:chartOptions
      });

//defining the looping function to calculate values used to define result

      function calc(supplyVoltage,ldrIntRes,jmpIntRes,wpxIntRes,wpxPower,numfix) {

//initializing recursive variables

        var V = supplyVoltage; //Vth ('thevenin voltage')
        //console.log(V);
        var Q = ldrIntRes;     //Rth ('thevenin resistance')
        //console.log(Q);
        var P = wpxPower;
        //console.log(P);
        var R = wpxIntRes;
        //console.log(R);

        //initialize mathjs variables

                var parser = math.parser();

                parser.set("V",V);
                parser.set("Q",Q);
                parser.set("P",P);
                parser.set("R",R);
                parser.set("RJ",jmpIntRes);

//defining equations as strings to be used with mathjs commands

        var expression1 = "-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))))";

        var expression2 = "-((-R*V+Q*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))+R*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))))))*((-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))^2-V*(-(-Q*V-2*R*V)/(4*(Q+R))+1/2*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)))+1/2*sqrt((-Q*V-2*R*V)^2/(2*(Q+R)^2)-(4*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))-(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))-(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))+(-(-Q*V-2*R*V)^3/(Q+R)^3+(4*(2*P*Q^2+2*P*R*Q+R*V^2)*(-Q*V-2*R*V))/(Q+R)^2+(16*P*Q*R*V)/(Q+R))/(4*sqrt((-Q*V-2*R*V)^2/(4*(Q+R)^2)-(2*(2*P*Q^2+2*P*R*Q+R*V^2))/(3*(Q+R))+(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3)/(3*2^(1/3)*(Q+R))+(2^(1/3)*(12*P^2*R*(Q+R)*Q^2+6*P*R*V*(-Q*V-2*R*V)*Q+(2*P*Q^2+2*P*R*Q+R*V^2)^2))/(3*(Q+R)*(16*P^3*Q^6-96*P^3*R*Q^5-240*P^3*R^2*Q^4+15*P^2*R*V^2*Q^4-128*P^3*R^3*Q^3+84*P^2*R^2*V^2*Q^3-6*P*R^2*V^4*Q^2+96*P^2*R^3*V^2*Q^2-24*P*R^3*V^4*Q+2*R^3*V^6+sqrt(-6912*P^6*R*Q^11-20736*P^6*R^2*Q^10+864*P^5*R*V^2*Q^10-20736*P^6*R^3*Q^9+5184*P^5*R^2*V^2*Q^9-6912*P^6*R^4*Q^8-351*P^4*R^2*V^4*Q^8+7776*P^5*R^3*V^2*Q^8-1512*P^4*R^3*V^4*Q^7+3456*P^5*R^4*V^2*Q^7+108*P^3*R^3*V^6*Q^6-432*P^4*R^4*V^4*Q^6))^(1/3))))))+P*Q))/(P*Q^2)";

        var Aeq = "(R^2)*((1/Q)+(1/R))";
        var Beq = "-(V/Q)*R";
        var Ceq = "wpxPower";

        var Isceq = "(sqrt(B^2-4*A*C)-B)/(2*A)";

        var Qeq = "(V/Isc)+RJ";

//initializing for loop variables

        var i, nodeVoltages, QREC, A, B, C, Isc;

        var counter = 0;
        var xlength = [counter,];


        for (i=0,nodeVoltages=[supplyVoltage]; i < numfix; i++) {

          //console.log(parser.get("V"),parser.get("Q"),parser.get("Isc"));

          V = parser.get("V");
          Q = parser.get("Q");

//evaluates node voltage at LED board 1 of fixture[i]

          var nodeVoltage1 = parser.eval(expression1);
          //console.log(nodeVoltage1);

//evaluates node voltage at LED board 2 of fixture[i]

          var nodeVoltage2 = parser.eval(expression2);
          //console.log(nodeVoltage2);

//adds value to result array for graphing

          nodeVoltages.push(nodeVoltage2);

//using mathjs to evaluate

          A = parser.eval(Aeq);
          parser.set("A",A)
          B = parser.eval(Beq);
          parser.set("B",B);
          C = wpxPower;
          parser.set("C",C);
          //console.log(parser.get("A"),parser.get("B"),parser.get("C"),parser.get("D"));

//short circuit current: NOT REAL VALUE FOR CURRENT

          Isc = parser.eval(Isceq);
          parser.set("Isc",Isc);

//sets V for next iteration

          V = nodeVoltage2;
          parser.set("V",V);

//sets Q for next iteration

          Q = parser.eval(Qeq);
          parser.set("Q",Q);

          //console.log(parser.get("Isc"));

          counter = counter+1;
          xlength.push(counter);

          console.log(parser.get("V"),parser.get("Q"),parser.get("Isc"));
        };

//calc function returns the important node voltages

        return {
          nodeVoltages,
          xlength
        };

      };

    }

  }
});
