// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import TdClient from 'casualchat/tdweb';

let client;
let isReadyToSendCode = false;

export function startClient(phoneNumber) {
    client = new TdClient({
        onUpdate: createUpdateFunction(phoneNumber),
    });
}

export async function sendVerificationCode(code) {
    if (!isReadyToSendCode) {
        throw new Error('Not Ready to Send Code');
    }
    await checkAuthenticationCode(code);
}

const send = async (messageObject) => {
    return client.send(messageObject);
};

const createUpdateFunction = (phoneNumber) => {
    return (updateObject) => {
        if (updateObject['@type'] === 'updateAuthorizationState') {
            if (updateObject.authorization_state['@type'] === 'authorizationStateWaitTdlibParameters') {
                setTdLibParameters();
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitEncryptionKey') {
                checkDatabaseEncryptionKey();
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitPhoneNumber') {
                setAuthenticationPhoneNumber(phoneNumber);
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitCode') {
                isReadyToSendCode = true;
                /* eslint-disable no-console */
                console.log('Ready for code');
            }
        }
    };
};

const setTdLibParameters = async () => {
    /* eslint-disable no-console */
    console.log('Sending tdlibparam');
    const result = await send({
        '@type': 'setTdlibParameters',
        parameters: {
            database_directory: './td-db',
            api_id: 2727981,
            api_hash: 'f74bb617138e30e349a7c93bed9477ca',
            system_language_code: 'en',
            device_model: 'Windows Machine',
            application_version: '1',
        },
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const checkDatabaseEncryptionKey = async () => {
    /* eslint-disable no-console */
    console.log('Sending encryption key');
    const result = await send({
        '@type': 'checkDatabaseEncryptionKey',
        encryption_key: null,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const setAuthenticationPhoneNumber = async (phoneNumber) => {
    /* eslint-disable no-console */
    console.log('Sending phone number');
    const result = await send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: phoneNumber,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const checkAuthenticationCode = async (code) => {
    /* eslint-disable no-console */
    console.log('Sending code');
    const result = await send({
        '@type': 'checkAuthenticationCode',
        code,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

