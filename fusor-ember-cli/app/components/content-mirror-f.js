import Ember from 'ember';
import TextFComponent from './text-f';
import setAdvancedTimeout from '../utils/set-advanced-timeout';
import request from 'ic-ajax';

const CDN_VERIFY_TIMEOUT = 3000;

export default TextFComponent.extend({
  responseCounter: 0,
  validationTrigger: null,
  isVerifyingContentMirror: false,

  didInsertElement: function (){
    if(this.get('cdnUrl')) {
      this.validateContentMirrorUrl();
    }
  },
  nskObserver: Ember.observer('cdnUrl', function() {
    this.validateContentMirrorUrl();
  }),
  validateContentMirrorUrl: function() {
    const validationTrigger = this.get('validationTrigger');

    if(!validationTrigger) {
      if(this.get('isVerifyingContentMirror') === false) {
        this.setIsVerifyingContentMirror(true);
      }

      // If there's no outstanding trigger and cdn has changed, set up trigger
      const trigger = setAdvancedTimeout(() => {
        const cdnUrl = this.get('cdnUrl');

        // == Protocol Check ==
        // Confirm the protocol is present
        // NOTE: This will need to be altered if file:// needs to be supported
        const protocolCheckRx = /^https?:\/\//;
        if(!protocolCheckRx.test(cdnUrl)) {
          this.setIsVerifyingContentMirror(false);
          this.setContentMirrorValidation(false, 'Missing http protocol');
          this.set('validationTrigger', null);
          return;
        }

        const token = Ember.$('meta[name="csrf-token"]').attr('content');
        const deploymentId = this.get('deploymentId');

        // Guard against race condition of newer responses returning faster
        // than old responses that could result in valid content mirrors
        // being marked invalid, or vice versa
        let responseCounter = this.get('responseCounter') + 1;
        this.set('responseCounter', responseCounter);

        request({
          url: `/fusor/api/v21/deployments/${deploymentId}/validate_cdn`,
          headers: {
            "Accept": "application/json",
            "X-CSRF-Token": token
          },
          data: {
            cdn_url: encodeURIComponent(cdnUrl)
          }
        }).then((res) => {
          // If this response is not the newest response (the closed over
          // responseCounter will be less than the responseCounter field),
          // we want throw away the result because we know a more accurate
          // result is incoming or already has updated our state
          if(responseCounter === this.get('responseCounter')) {
            this.setContentMirrorValidation(res.cdn_url_code === "200");
          }
        }).catch((err) => {
          if(responseCounter === this.get('responseCounter')) {
            this.setContentMirrorValidation(false);
          }
        }).finally(() => {
          if(responseCounter === this.get('responseCounter')) {
            this.setIsVerifyingContentMirror(false);
            this.set('validationTrigger', null);
          }
        });

      }, CDN_VERIFY_TIMEOUT); // End advancedTimeout def

      this.set('validationTrigger', trigger);

    } else if(!validationTrigger.called){
      // If trigger exists but hasn't been called yet, extend timeout
      validationTrigger.reset(CDN_VERIFY_TIMEOUT);
    }
  },
  setContentMirrorValidation: function(isValid, validationMsg) {
    this.set('isContentMirrorValid', isValid);

    if(isValid) {
      if(!validationMsg) {
        this.set(
          'contentMirrorValidationMsg',
          'Content mirror verified'
        );
      }
      this.sendAction('mirrorStatusUpdate', this.get('MirrorStatus').VALID);
    } else {
      if(!validationMsg) {
        this.set(
          'contentMirrorValidationMsg',
          'Invalid content mirror'
        );
      }
      this.sendAction('mirrorStatusUpdate', this.get('MirrorStatus').INVALID);
    }

    if(validationMsg) {
      this.set(
        'contentMirrorValidationMsg',
        validationMsg
      );
    }
  },
  setIsVerifyingContentMirror: function(isVerifying) {
    this.set('isVerifyingContentMirror', isVerifying);

    if(isVerifying) {
      this.sendAction(
        'mirrorStatusUpdate', this.get('MirrorStatus').VALIDATING);
    }
  }
});
