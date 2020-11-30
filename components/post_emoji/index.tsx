// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {checkEmojiAccess, savePrivateEmoji, getEmojiUrlByUser} from 'casualchat/CasualChatClient';

import {getEmojiMap} from 'selectors/emojis';

import {GlobalState} from 'types/store';

import PostEmoji from './post_emoji';

type Props = {
    name: string;
    userId: string;
};

function mapStateToProps(state: GlobalState, ownProps: Props) {
    const emojiMap = getEmojiMap(state);
    const emoji = emojiMap.get(ownProps.name);
    const currentUserId = getCurrentUserId(state);

    return {
        imageUrl: emoji ? getEmojiUrlByUser(ownProps.userId, emoji) : '',
        emoji,
        viewerUserId: currentUserId,
        clientFuncs: {
            checkEmojiAccess,
            savePrivateEmoji
        }
    };
}

export default connect(mapStateToProps)(PostEmoji);
