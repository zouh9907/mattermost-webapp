// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {
    getChannelByNameAndTeamName,
    selectChannel,
} from 'mattermost-redux/actions/channels';
import {getTeam, getMyTeams, getMyTeamMember} from 'mattermost-redux/selectors/entities/teams';
import {getChannelByName} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {getCurrentLocale} from 'selectors/i18n';
import {filterAndSortTeamsByDisplayName} from 'utils/team_utils.jsx';
import LocalStorageStore from 'stores/local_storage_store';
import {browserHistory} from 'utils/browser_history';
import store from 'stores/redux_store.jsx';

const getState = store.getState;
const dispatch = store.dispatch;

// export async function redirectUserToDefaultTeam() {
//     const state = getState();
//     const userId = getCurrentUserId(state);
//     const locale = getCurrentLocale(state);
//     const teamId = LocalStorageStore.getPreviousTeamId(userId);

//     let team = getTeam(state, teamId);
//     const myMember = getMyTeamMember(state, teamId);

//     if (!team || !myMember || !myMember.team_id) {
//         team = null;
//         let myTeams = getMyTeams(state);

//         if (myTeams.length > 0) {
//             myTeams = filterAndSortTeamsByDisplayName(myTeams, locale);
//             if (myTeams && myTeams[0]) {
//                 team = myTeams[0];
//             }
//         }
//     }

//     if (userId && team) {
//         let channelName = LocalStorageStore.getPreviousChannelName(userId, teamId);
//         const channel = getChannelByName(state, channelName);
//         if (channel && channel.team_id === team.id) {
//             dispatch(selectChannel(channel.id));
//             channelName = channel.name;
//         } else {
//             const {data} = await dispatch(getChannelByNameAndTeamName(team.name, channelName));
//             if (data) {
//                 dispatch(selectChannel(data.id));
//             }
//         }

//         browserHistory.push(`/${team.name}/channels/${channelName}`);
//     } else {
//         browserHistory.push('/select_team');
//     }
// }

export async function defaultTeam() {
    const state = getState();
    const userId = getCurrentUserId(state);
    const locale = getCurrentLocale(state);
    const teamId = LocalStorageStore.getPreviousTeamId(userId);

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

        browserHistory.push(`/${team.name}/channels/${channelName}`);
    } else {
        browserHistory.push('/select_team');
    }
}
