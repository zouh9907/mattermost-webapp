// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getLicense, getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId, getCurrentUser, shouldShowTermsOfService} from 'mattermost-redux/selectors/entities/users';
import {getTeam, getMyTeams, getMyTeamMember} from 'mattermost-redux/selectors/entities/teams';
import {getChannelByName} from 'mattermost-redux/selectors/entities/channels';

import {checkIfMFARequired} from 'utils/route';
import {getCurrentLocale} from 'selectors/i18n';
import LocalStorageStore from 'stores/local_storage_store';
import {filterAndSortTeamsByDisplayName} from 'utils/team_utils.jsx';

import Switch from './switch.jsx';

function defaultRoute(state) {
    const userId = getCurrentUserId(state);

    if (!userId) {
        return '/login';
    }

    const teamId = LocalStorageStore.getPreviousTeamId(userId);
    const locale = getCurrentLocale(state);

    let team = getTeam(state, teamId);
    const myMember = getMyTeamMember(state, teamId);

    if (!team || !myMember || !myMember.team_id) {
        team = null;
        let myTeams = getMyTeams(state);

        if (myTeams.length > 0) {
            myTeams = filterAndSortTeamsByDisplayName(myTeams, locale);
            if (myTeams && myTeams[0]) {
                team = myTeams[0];
            }
        }
    }

    if (userId && team) {
        let channelName = LocalStorageStore.getPreviousChannelName(userId, teamId);
        const channel = getChannelByName(state, channelName);
        if (channel && channel.team_id === team.id) {
            channelName = channel.name;
        }

        return `/${team.name}/channels/${channelName}`;
    }

    return '/select_team';
}

function mapStateToProps(state) {
    const license = getLicense(state);
    const config = getConfig(state);

    return {
        defaultRoute: defaultRoute(state),
        noAccounts: config.NoAccounts === 'true',
        mfaRequired: checkIfMFARequired(getCurrentUser(state), license, config),
        showTermsOfService: shouldShowTermsOfService(state),
        iosDownloadLink: config.IosAppDownloadLink,
        androidDownloadLink: config.AndroidAppDownloadLink,
    };
}

export default withRouter(connect(mapStateToProps)(Switch));
