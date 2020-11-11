// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getEmojiUrlByUser} from 'casualchat/CasualChatClient';

import {getEmojiMap} from 'selectors/emojis';

import {GlobalState} from 'types/store';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import PostEmoji from './post_emoji';

type Props = {
    name: string;
};

function mapStateToProps(state: GlobalState, ownProps: Props) {
    const emojiMap = getEmojiMap(state);
    const emoji = emojiMap.get(ownProps.name);
    const userId = getCurrentUserId(state);

    return {
        imageUrl: emoji ? getEmojiUrlByUser(userId,emoji) : '',
    };
}

export default connect(mapStateToProps)(PostEmoji);
