// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ErrorPageTypes} from 'utils/constants.jsx';
import {browserHistory} from 'utils/browser_history';

export function importComponentSuccess(callback) {
    return (comp) => callback(null, comp.default);
}

export function createGetChildComponentsFunction(arrayOfComponents) {
    return (locaiton, callback) => callback(null, arrayOfComponents);
}

export const notFoundParams = {
    type: ErrorPageTypes.PAGE_NOT_FOUND,
};

const mfaAuthServices = [
    '',
    'email',
    'ldap',
];

export function checkIfMFARequired(user, license, config) {
    return license.MFA === 'true' &&
           config.EnableMultifactorAuthentication === 'true' &&
           config.EnforceMultifactorAuthentication === 'true' &&
           user &&
           !user.mfa_active &&
           mfaAuthServices.indexOf(user.auth_service) !== -1;
}

// defaultRedirect passes control back to the Root component to decide where next to route.
export function defaultRedirect(search) {
    var redirectTo = '/';

    if (search) {
        redirectTo += '?' + search;
    }

    browserHistory.push(redirectTo);
}

