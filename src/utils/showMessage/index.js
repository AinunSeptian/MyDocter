import React from 'react';
import {showMessage} from 'react-native-flash-message';
import {colors} from '../colors';

export const showError = message => {
  showMessage({
    message: message,
    type: 'default',
    backgroundColor: colors.error,
    color: colors.white,
    duration: 5000,
  });
};

export const showSucces = message => {
  showMessage({
    message: message,
    type: 'default',
    backgroundColor: colors.primary,
    color: colors.white,
    duration: 5000,
  });
};
