// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {shallow} from 'enzyme';

import EmojiPrivate from './emoji_private';

describe('casualchat/components/emoji-private', () => {
    const baseProps = {
        teamId: 'team-id',
        teamName: 'team-name',
        teamDisplayName: 'team-display-name',
        siteName: 'site-Name',
        scrollToTop: jest.fn(),
        actions: {
            loadRolesIfNeeded: jest.fn(),
        },
    };
    test('should match snapshot', () => {
        const wrapper = shallow(<EmojiPrivate {...baseProps}/>);
        expect(wrapper).toMatchSnapshot();
    });
});
