// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedDate, FormattedMessage, FormattedTime} from 'react-intl';

import Constants from 'utils/constants';
import * as Utils from 'utils/utils.jsx';
import SettingItemMax from 'components/setting_item_max.jsx';
import SettingItemMin from 'components/setting_item_min';
import SaveButton from 'components/save_button';

const SECTION_TELEGRAM = 'telegram';

export default class ExtChatTab extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object,
        activeSection: PropTypes.string,
        updateSection: PropTypes.func,
        closeModal: PropTypes.func.isRequired,
        collapseModal: PropTypes.func.isRequired,
        setRequireConfirm: PropTypes.func.isRequired,

        /*
         * Set if access tokens are enabled and this user can use them
         */
        canUseAccessTokens: PropTypes.bool,

        // Whether or not OAuth applications are enabled.
        enableOAuthServiceProvider: PropTypes.bool,

        // Whether or not sign-up with email is enabled.
        enableSignUpWithEmail: PropTypes.bool,

        // Whether or not sign-up with GitLab is enabled.
        enableSignUpWithGitLab: PropTypes.bool,

        // Whether or not sign-up with Google is enabled.
        enableSignUpWithGoogle: PropTypes.bool,

        // Whether or not sign-up with LDAP is enabled.
        enableLdap: PropTypes.bool,

        // Whether or not sign-up with SAML is enabled.
        enableSaml: PropTypes.bool,

        // Whether or not sign-up with Office 365 is enabled.
        enableSignUpWithOffice365: PropTypes.bool,

        // Whether or not the experimental authentication transfer is enabled.
        experimentalEnableAuthenticationTransfer: PropTypes.bool,

        passwordConfig: PropTypes.object,
        militaryTime: PropTypes.bool,

        actions: PropTypes.shape({
            getMe: PropTypes.func.isRequired,
            updateUserPassword: PropTypes.func.isRequired,
            getAuthorizedOAuthApps: PropTypes.func.isRequired,
            deauthorizeOAuthApp: PropTypes.func.isRequired,
        }),
        telegram: PropTypes.shape({
            sendVerificationCode: PropTypes.func.isRequired,
            startClient: PropTypes.func.isRequired,
        }),
    }

    static defaultProps = {
        user: {},
        activeSection: '',
    };

    constructor(props) {
        super(props);

        this.state = this.getDefaultState();
    }

    getDefaultState() {
        return {
            phoneNumber: '',
            code: '',
            phoneNumberError: '',
            codeError: '',
            serverError: '',

            // tokenError: '',
            // authService: this.props.user.auth_service,
            savingPassword: false,
        };
    }

    componentDidMount() {
        // if (this.props.enableOAuthServiceProvider) {
        //     this.loadAuthorizedOAuthApps();
        // }
    }

    loadAuthorizedOAuthApps = async () => {
        const {data, error} = await this.props.actions.getAuthorizedOAuthApps();
        if (data) {
            this.setState({authorizedApps: data, serverError: null}); //eslint-disable-line react/no-did-mount-set-state
        } else if (error) {
            this.setState({serverError: error.message}); //eslint-disable-line react/no-did-mount-set-state
        }
    }

    submitPhoneNumber = async () => {
        // const user = this.props.user;
        // const currentPhoneNumber = this.state.currentPhoneNumber;

        // if (currentPhoneNumber === '') {
        //     this.setState({passwordError: Utils.localizeMessage('user.settings.security.currentPasswordError', 'Please enter your current password.'), serverError: ''});
        //     return;
        // }

        // // const {valid, error} = Utils.isValidPassword(newPassword, this.props.passwordConfig);
        // // if (!valid && error) {
        // //     this.setState({
        // //         passwordError: error,
        // //         serverError: '',
        // //     });
        // //     return;
        // // }

        // // if (newPassword !== confirmPassword) {
        // //     const defaultState = Object.assign(this.getDefaultState(), {passwordError: Utils.localizeMessage('user.settings.security.passwordMatchError', 'The new passwords you entered do not match.'), serverError: ''});
        // //     this.setState(defaultState);
        // //     return;
        // // }

        // this.setState({savingPassword: true});

        // // const {data, error: err} = await this.props.actions.updateUserPassword(
        // //     user.id,
        // //     phoneNumber,
        // //     code,
        // // );
        // if (data) {
        //     this.props.updateSection('');
        //     this.props.actions.getMe();
        //     this.setState(this.getDefaultState());
        // } else if (err) {
        //     const state = this.getDefaultState();
        //     if (err.message) {
        //         state.serverError = err.message;
        //     } else {
        //         state.serverError = err;
        //     }
        //     state.passwordError = '';
        //     this.setState(state);
        // }
    }

    updatePhoneNumber = (e) => {
        this.setState({phoneNumber: e.target.value});
    }

    updateCode = (e) => {
        this.setState({code: e.target.value});
    }

    updateConfirmPassword = (e) => {
        this.setState({confirmPassword: e.target.value});
    }

    deauthorizeApp = async (e) => {
        e.preventDefault();

        const appId = e.currentTarget.getAttribute('data-app');

        const {data, error} = await this.props.actions.deauthorizeOAuthApp(appId);
        if (data) {
            const authorizedApps = this.state.authorizedApps.filter((app) => {
                return app.id !== appId;
            });
            this.setState({authorizedApps, serverError: null});
        } else if (error) {
            this.setState({serverError: error.message});
        }
    }

    handleUpdateSection = (section) => {
        if (section) {
            this.props.updateSection(section);
        } else {
            switch (this.props.activeSection) {
            case SECTION_TELEGRAM:
                this.setState({
                    phoneNumber: '',
                    code: '',
                    serverError: null,
                    phoneNumberError: null,
                    codeError: null,
                });
                break;
            default:
            }

            this.props.updateSection('');
        }
    }

    createPasswordSection = () => {
        if (this.props.activeSection === SECTION_TELEGRAM) {
            const inputs = [];
            let submit;

            if (this.props.user.auth_service === '') {
                submit = this.submitPassword;

                inputs.push(
                    <div
                        key='PhoneUpdateForm'
                        className='form-group'
                    >
                        <label className='col-sm-5 control-label'>
                            <FormattedMessage
                                id='user.settings.security.phone_number'
                                defaultMessage='Phone Number'
                            />
                        </label>
                        <div className='col-sm-7'>
                            <input
                                id='phoneNumber'
                                autoFocus={true}
                                className='form-control'
                                type='text'
                                onChange={this.updatePhoneNumber}
                                value={this.state.phoneNumber}
                                aria-label={Utils.localizeMessage('user.settings.security.phone_number', 'Phone Number')}
                            />
                        </div>
                        <SaveButton
                            defaultMessage={
                                <FormattedMessage
                                    id='user.settings.extchat.get_code'
                                    defaultMessage='Get Code'
                                />}
                            saving={false}
                            disabled={false}
                            onClick={() => {
                                this.props.telegram.startClient(this.state.phoneNumber);
                            }}
                        />
                    </div>,
                );
                inputs.push(
                    <div
                        key='newCodeUpdateForm'
                        className='form-group'
                    >
                        <label className='col-sm-5 control-label'>
                            <FormattedMessage
                                id='user.settings.security.code'
                                defaultMessage='Verification Code'
                            />
                        </label>
                        <div className='col-sm-7'>
                            <input
                                id='newCode'
                                className='form-control'
                                type='text'
                                onChange={this.updateCode}
                                value={this.state.code}
                                aria-label={Utils.localizeMessage('user.settings.security.code', 'Verification Code')}
                            />
                        </div>
                        <SaveButton
                            defaultMessage={
                                <FormattedMessage
                                    id='user.settings.extchat.verify_code'
                                    defaultMessage='Verify Code'
                                />}
                            saving={false}
                            disabled={false}
                            onClick={() => {
                                this.props.telegram.sendVerificationCode(this.state.code);
                            }}
                        />
                    </div>,
                );
            }

            return (
                <SettingItemMax
                    title={
                        <FormattedMessage
                            id='user.settings.security.password'
                            defaultMessage='Password'
                        />
                    }
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.savingPassword}
                    serverError={this.state.serverError}
                    clientError={this.state.phoneNumberError}
                    updateSection={this.handleUpdateSection}
                />
            );
        }

        let describe;

        if (this.props.user.auth_service === '') {
            const d = new Date(this.props.user.last_password_update);

            describe = (
                <FormattedMessage
                    id='user.settings.security.lastUpdated'
                    defaultMessage='Last updated {date} at {time}'
                    values={{
                        date: (
                            <FormattedDate
                                value={d}
                                day='2-digit'
                                month='short'
                                year='numeric'
                            />
                        ),
                        time: (
                            <FormattedTime
                                value={d}
                                hour12={!this.props.militaryTime}
                                hour='2-digit'
                                minute='2-digit'
                            />
                        ),
                    }}
                />
            );
        } else if (this.props.user.auth_service === Constants.GITLAB_SERVICE) {
            describe = (
                <FormattedMessage
                    id='user.settings.security.loginGitlab'
                    defaultMessage='Login done through GitLab'
                />
            );
        } else if (this.props.user.auth_service === Constants.LDAP_SERVICE) {
            describe = (
                <FormattedMessage
                    id='user.settings.security.loginLdap'
                    defaultMessage='Login done through AD/LDAP'
                />
            );
        } else if (this.props.user.auth_service === Constants.SAML_SERVICE) {
            describe = (
                <FormattedMessage
                    id='user.settings.security.loginSaml'
                    defaultMessage='Login done through SAML'
                />
            );
        } else if (this.props.user.auth_service === Constants.GOOGLE_SERVICE) {
            describe = (
                <FormattedMessage
                    id='user.settings.security.loginGoogle'
                    defaultMessage='Login done through Google Apps'
                />
            );
        } else if (this.props.user.auth_service === Constants.OFFICE365_SERVICE) {
            describe = (
                <FormattedMessage
                    id='user.settings.security.loginOffice365'
                    defaultMessage='Login done through Office 365'
                />
            );
        }

        return (
            <SettingItemMin
                title={
                    <FormattedMessage
                        id='user.settings.extchat.phone_number'
                        defaultMessage='Phone Number'
                    />
                }
                describe={describe}
                section={SECTION_TELEGRAM}
                updateSection={this.handleUpdateSection}
                focused={true}
            />
        );
    }

    render() {
        const passwordSection = this.createPasswordSection();

        // let numMethods = 0;
        // numMethods = this.props.enableSignUpWithGitLab ? numMethods + 1 : numMethods;
        // numMethods = this.props.enableSignUpWithGoogle ? numMethods + 1 : numMethods;
        // numMethods = this.props.enableSignUpWithOffice365 ? numMethods + 1 : numMethods;
        // numMethods = this.props.enableLdap ? numMethods + 1 : numMethods;
        // numMethods = this.props.enableSaml ? numMethods + 1 : numMethods;

        return (
            <div>
                <div className='modal-header'>
                    <FormattedMessage
                        id='user.settings.extchat.close'
                        defaultMessage='Close'
                    >
                        {(ariaLabel) => (
                            <button
                                type='button'
                                className='close'
                                data-dismiss='modal'
                                aria-label={ariaLabel}
                                onClick={this.props.closeModal}
                            >
                                <span aria-hidden='true'>{'×'}</span>
                            </button>
                        )}
                    </FormattedMessage>
                    <h4
                        className='modal-title'
                        ref='title'
                    >
                        <div className='modal-back'>
                            <FormattedMessage
                                id='generic_icons.collapse'
                                defaultMessage='Collapse Icon'
                            >
                                {(title) => (
                                    <i
                                        className='fa fa-angle-left'
                                        title={title}
                                        onClick={this.props.collapseModal}
                                    />
                                )}
                            </FormattedMessage>
                        </div>
                        <FormattedMessage
                            id='user.settings.extchat.title'
                            defaultMessage='External Chat Settings'
                        />
                    </h4>
                </div>
                <div className='user-settings'>
                    <h3 className='tab-header'>
                        <FormattedMessage
                            id='user.settings.extchat.title'
                            defaultMessage='External Chat Settings'
                        />
                    </h3>
                    <div className='divider-dark first'/>
                    {passwordSection}
                    <div className='divider-light'/>

                </div>
            </div>
        );
    }
}
/* eslint-enable react/no-string-refs */
