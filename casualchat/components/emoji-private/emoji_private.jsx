// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

import Permissions from 'mattermost-redux/constants/permissions';

import * as Utils from 'utils/utils.jsx';
import AnyTeamPermissionGate from 'components/permissions_gates/any_team_permission_gate';

import EmojiList from 'components/emoji/emoji_list';

export default class EmojiPage extends React.PureComponent {
    static propTypes = {
        teamId: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
        teamDisplayName: PropTypes.string.isRequired,
        siteName: PropTypes.string,
        scrollToTop: PropTypes.func.isRequired,
        actions: PropTypes.shape({
            loadRolesIfNeeded: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        teamName: '',
        teamDisplayName: '',
        siteName: '',
    }

    componentDidMount() {
        this.updateTitle();
        this.props.actions.loadRolesIfNeeded(['system_admin', 'team_admin', 'system_user', 'team_user']);
    }

    updateTitle = () => {
        document.title = Utils.localizeMessage('custom_emoji.header-private', 'Private Emoji') + ' - ' + this.props.teamDisplayName + ' ' + this.props.siteName;
    }

    componentDidUpdate(prevProps) {
        if (this.props.siteName !== prevProps.siteName) {
            this.updateTitle();
        }
    }

    render() {
        return (
            <div className='backstage-content emoji-list'>
                <div className='backstage-header'>
                    <h1>
                        <FormattedMessage
                            id='emoji_list.header'
                            defaultMessage='Private Emoji'
                        />
                    </h1>

                        <Link
                            className='add-link'
                            to={'/' + this.props.teamName + '/emoji/add_private'}
                        >
                            <button
                                type='button'
                                className='btn btn-primary'
                            >
                                <FormattedMessage
                                    id='emoji_list.add-private'
                                    defaultMessage='Add Private Emoji'
                                />
                            </button>
                        </Link>

                </div>
                <EmojiList scrollToTop={this.props.scrollToTop} isPrivate={true}/>
            </div>
        );
    }
}
