import { required, maxLength, minLength, requiredIf } from 'vuelidate/lib/validators';

export default {
  validations: {
    clinicSession: {
      // Autres champs...
      s_one_start_time: {
        // Conditions modifiées pour être optionnelles mais nécessitent une logique pour vérifier si l'une des sessions est remplie
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_end_time || this.clinicSession.s_two_start_time || this.clinicSession.s_two_end_time);
        })
      },
      s_one_end_time: {
        // Conditions modifiées similaires à `s_one_start_time`
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_two_start_time || this.clinicSession.s_two_end_time);
        })
      },
      s_two_start_time: {
        // Conditions modifiées pour être optionnelles
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_one_end_time || this.clinicSession.s_two_end_time);
        })
      },
      s_two_end_time: {
        // Conditions modifiées similaires à `s_two_start_time`
        requiredIf: requiredIf(function() {
          return !!(this.clinicSession.s_one_start_time || this.clinicSession.s_one_end_time || this.clinicSession.s_two_start_time);
        })
      },
      // Validation personnalisée pour vérifier au moins une session remplie
      atLeastOneSession: {
        customValidator(value) {
          // `this` est votre vue instance
          return (this.clinicSession.s_one_start_time && this.clinicSession.s_one_end_time) ||
                 (this.clinicSession.s_two_start_time && this.clinicSession.s_two_end_time);
        }
      }
    }
  }
}
