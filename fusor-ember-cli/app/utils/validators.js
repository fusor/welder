/* global Address4:false */

import Ember from 'ember';

const Validator = Ember.Object.extend({
  isValid(value) {
    //override me
    return false;
  },

  isInvalid(value) {
    return !this.isValid(value);
  },

  getMessages(value) {
    if (this.isValid(value)) {
      return [];
    }
    let message = this.get('message');
    if (message) {
      return [message];
    }
    let messages = this.get('messages');
    return messages ? messages : [`${value} is invalid`];
  }
});

const AllValidator = Validator.extend({
  isValid(value) {
    let validators = this.get('validators');
    return validators ? validators.every(validator => validator.isValid(value)) : true;
  },

  getMessages(value) {
    let message = this.get('message'), messages = [], validators = this.get('validators');

    if (message) {
      return this.isValid(value) ? [] : [message];
    }

    if (validators) {
      validators.forEach(validator =>
        validator.getMessages(value).forEach(message => messages.push(message))
      );
    }

    return messages;
  }
});

const AnyValidator = Validator.extend({
  isValid(value) {
    let validators = this.get('validators');
    return validators ? validators.any(validator => validator.isValid(value)) : true;
  }
});

const PresenceValidator = Validator.extend({
  message: 'This field cannot be blank.',

  isValid(value) {
    return Ember.isPresent(value);
  }
});

// expects values to be set during construction:
// equals;
const EqualityValidator = Validator.extend({
  isValid(value) {
    let equals = this.get('equals');
    let doesNotEqual = this.get('doesNotEqual');

    return (Ember.isBlank(equals) || value === equals) &&
      (Ember.isBlank(doesNotEqual) || value !== doesNotEqual);
  },

  getMessages(value) {
    let equals = this.get('equals');
    let doesNotEqual = this.get('doesNotEqual');

    if (Ember.isPresent(equals) && value !== equals) {
      if (this.get('message')) {
        return [this.get('message')];
      } else {
        return ['This value does not match.'];
      }
    }

    if (Ember.isPresent(doesNotEqual) && value === doesNotEqual) {
      if (this.get('message')) {
        return [this.get('message')];
      } else {
        return [`This field must not equal ${doesNotEqual}`];
      }
    }

    return [];
  }
});

const NumberValidator = Validator.extend({
  isValid(value) {
    let min = this.get('min'), max = this.get('max');

    return (Ember.isBlank(min) || value >= min) &&
      (Ember.isBlank(max) || value <= max);
  },

  getMessages(value) {
    let min = this.get('min'), max = this.get('max');

    if (Ember.isPresent(min) && value < min) {
      return [`This field must be greater than or equal to ${min}.`];
    }

    if (Ember.isPresent(max) && value > max) {
      return [`This field must be less than or equal to ${max}.`];
    }

    return [];
  }
});

const IntegerValidator = Validator.extend({
  message: 'This field must be an integer.',

  isValid(value) {
    //http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
  }
});

const LengthValidator = Validator.extend({
  isValid(value) {
    let min = this.get('min'), max = this.get('max');

    // Allow blanks for optional fields, must use PresenceValidator
    if (Ember.isBlank(value)) {
      return true;
    }

    return (Ember.isBlank(min) || value.length >= min) &&
      (Ember.isBlank(max) || value.length <= max);
  },

  getMessages(value) {
    let min = this.get('min'), max = this.get('max');

    if (Ember.isBlank(value)) {
      return [];
    }

    if (Ember.isPresent(min) && value.length < min) {
      return [`This field must be ${min} or more characters.`];
    }

    if (Ember.isPresent(max) && value.length > max) {
      return [`This field must be ${max} characters or less.`];
    }

    return [];
  }
});

const PasswordValidator = LengthValidator.extend({min: 8});

const RequiredPasswordValidator = AllValidator.extend({
  validators: [
    PresenceValidator.create({}),
    PasswordValidator.create({})
  ]
});

// expects values to be set during construction:
// Array[String] values;
const UniquenessValidator = Validator.extend({
  message: 'This name is already in use.',

  isValid(value) {
    let existingValues = this.get('existingValues');
    if (!existingValues) {
      return true;
    }

    let cleanValue = Ember.typeOf(value) === 'string' ? value.trim() : value;

    if (!this.get('selfIncluded')) {
      return !(existingValues.contains(cleanValue));
    }

    let numFound = 0;
    for (let i = 0; i < existingValues.length; i++) {
      let existingValue = Ember.typeOf(existingValues[i]) === 'string' ? existingValues[i].trim() : existingValues[i];
      if (existingValue === cleanValue) {
        numFound++;
      }
      if (numFound > 1) {
        return false;
      }
    }

    return true;
  }
});

// expects values to be set during construction:
// RegExp regExp;
// String message;
const RegExpValidator = Validator.extend({
  trim: true,

  isValid(value) {
    let trimmedValue = this.get('trim') && Ember.typeOf(value) === 'string' ? value.trim() : value;
    return Ember.isBlank(trimmedValue) || this.get('regExp').test(trimmedValue);
  }
});


const AlphaNumericDashUnderscoreValidator = RegExpValidator.extend({
  regExp: new RegExp(/^[A-Za-z0-9_-]*$/),
  message: "This field must contain only 'A-Z', 'a-z', '0-9', '_' or '-' characters."
});

const IpRangeValidator = RegExpValidator.extend({
  regExp: new RegExp([
    '\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'
  ].join(''), ''),
  message: 'This is an invalid network range.'
});

const IpAddressValidator = RegExpValidator.extend({
  regExp: new RegExp([
    '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
  ].join(''), ''),
  message: 'This is an invalid ip address.'
});

const IpTypoValidator = Validator.extend({
  isValid(value) {
    let a = value.split('.');
    if (a && a.get('length') === 4) {
      let matches = value.match(/[^0-9\\.]/g);
      if (matches && matches.length < 3) {
        return false;
      }
    }
    return true;
  },
  message: 'There appears to be a typo in the IP address.'
});

const CidrValidator = RegExpValidator.extend({
  regExp: new RegExp([
    '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}',
    '([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
    '(\/([0-9]|[1-2][0-9]|3[0-2]))$'
  ].join(''), ''),
  message: 'This is an invalid CIDR notation.'
});

// expects values to be set during construction:
// String subnet;
const IpSubnetValidator = Validator.extend({
  ipAddressValidator: IpAddressValidator.create(),
  cidrValidator: CidrValidator.create(),

  isValidSubnet() {
    let subnetStr = this.get('subnet');
    return Ember.isPresent(subnetStr) && this.get('cidrValidator').isValid(subnetStr);
  },

  isValidIpAddress(ipAddress) {
    return Ember.isPresent(ipAddress) && this.get('ipAddressValidator').isValid(ipAddress);
  },

  isValid(value) {
    let ipAddress, subnet;
    let subnetStr = this.get('subnet');

    if (Ember.isEmpty(value) || !this.isValidSubnet() || !this.isValidIpAddress(value)) {
      return false;
    }

    ipAddress = new Address4(value);
    subnet = new Address4(subnetStr);
    return ipAddress.isInSubnet(subnet);
  },

  getMessages(value) {
    let subnet = this.get('subnet');

    if (Ember.isEmpty(value) || !this.isValidIpAddress(value)) {
      return ['This is an invalid ip address.'];
    }

    if (!this.isValidSubnet()) {
      return ['The associated subnet is invalid.'];
    }

    if (!this.isValid(value)) {
      return [`This must belong to subnet ${subnet}.`];
    }

    return [];
  }
});

const NoSpacesValidator = Validator.extend({
  message: 'This field must not have spaces.',
  isValid(value) {
    let spaceRegex = /\s/;
    return !spaceRegex.test(value);
  }
});

const MacAddressValidator = RegExpValidator.extend({
  regExp: new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
  message: 'This is an invalid MAC address.'
});

const HostnameValidator = RegExpValidator.extend({
  regExp: new RegExp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/),
  message: 'This is an invalid hostname.'
});

const HostAddressValidator = AnyValidator.extend({
  validators: [
    IpAddressValidator.create({}),
    HostnameValidator.create({})
  ],
  message: 'This is an invalid host or ip address.'
});

const NoTrailingSlashValidator = Validator.extend({
  message: 'This field cannot have a trailing slash.',
  isValid(value) {
    return value.slice(-1) !== '/';
  }
});

const LeadingSlashValidator = Validator.extend({
  message: 'This field must have a leading slash.',
  isValid(value) {
    return value.charAt(0) === '/';
  }
});

const StoragePathValidator = AllValidator.extend({
  validators: [
    LeadingSlashValidator.create({}),
    NoTrailingSlashValidator.create({}),
    NoSpacesValidator.create({})
  ]
});

function validateZipper(zipper){
  return zipper
    .map((pair) => pair[0].isValid(pair[1]))
    .reduce((lhs, rhs) => lhs && rhs);
}

export {
  Validator,
  AllValidator,
  AnyValidator,
  PresenceValidator,
  EqualityValidator,
  NumberValidator,
  IntegerValidator,
  LengthValidator,
  PasswordValidator,
  RequiredPasswordValidator,
  UniquenessValidator,
  RegExpValidator,
  AlphaNumericDashUnderscoreValidator,
  IpRangeValidator,
  IpAddressValidator,
  IpTypoValidator,
  CidrValidator,
  IpSubnetValidator,
  HostAddressValidator,
  MacAddressValidator,
  HostnameValidator,
  StoragePathValidator,
  validateZipper
};
