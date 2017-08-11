import Ember from 'ember';
import math from 'npm:mathjs';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash (
      {
        psus: this.store.findAll('psu'),
        ldrs: this.store.findAll('ldr'),
        jmps: this.store.findAll('jmp'),
        wpxes: this.store.findAll('wpx')
      }
    )
  }
});
