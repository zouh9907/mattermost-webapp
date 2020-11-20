// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import waitForExpect from 'wait-for-expect';
import {act} from '@testing-library/react';

import PostEmoji from './post_emoji';

describe('PostEmoji', () => {
    const baseProps = {
        imageUrl: '/api/v4/emoji/1234/image',
        name: 'emoji',
        userId: 'userId',
        viewerUserId: 'viewerId',
        emoji: undefined,
        clientFuncs: {
            checkEmojiAccess: jest.fn().mockResolvedValue(true),
            savePrivateEmoji: jest.fn()
        }
    };
    const basePropsNoAccess = {
        ...baseProps,
        clientFuncs: {
            ...baseProps.clientFuncs,
            checkEmojiAccess: jest.fn().mockImplementation((userId) => {
                if (userId === baseProps.userId) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            })
        }
    };
    test('should check access when rendered', async () => {
        shallow(<PostEmoji {...baseProps}/>);
        await waitForExpect(() => {
            expect(baseProps.clientFuncs.checkEmojiAccess).toHaveBeenCalledTimes(2);
            expect(baseProps.clientFuncs.checkEmojiAccess).toHaveBeenCalledWith(baseProps.userId, baseProps.emoji);
            expect(baseProps.clientFuncs.checkEmojiAccess).toHaveBeenCalledWith(baseProps.viewerUserId, baseProps.emoji);
        });
    });

    test('should add emoji when clicked if no access', async () => {
        const wrapper = shallow(<PostEmoji {...basePropsNoAccess}/>);
        await waitForExpect(() => {
            expect(wrapper.state('canSenderAccess')).toBe(true);
        });
        wrapper.update();
        act(() => {
            wrapper.find('span').simulate('click');
        });
        await waitForExpect(() => {
            expect(basePropsNoAccess.clientFuncs.savePrivateEmoji).toHaveBeenCalledTimes(1);
            expect(basePropsNoAccess.clientFuncs.savePrivateEmoji).toHaveBeenCalledWith(baseProps.viewerUserId, baseProps.emoji);

            expect(basePropsNoAccess.clientFuncs.checkEmojiAccess).toHaveBeenCalledTimes(4);
            expect(basePropsNoAccess.clientFuncs.checkEmojiAccess).toHaveBeenCalledWith(baseProps.userId, baseProps.emoji);
            expect(basePropsNoAccess.clientFuncs.checkEmojiAccess).toHaveBeenCalledWith(baseProps.viewerUserId, baseProps.emoji);
        });
    });

    test('should render image when imageUrl is provided', async () => {
        const wrapper = shallow(<PostEmoji {...baseProps}/>);
        await waitForExpect(() => {
            expect(wrapper.state('canSenderAccess')).toBe(true);
        });
        wrapper.update();
        expect(wrapper.find('span').prop('style')).toMatchObject({
            backgroundImage: `url(${baseProps.imageUrl})`,
        });
    });

    test('should render shortcode text within span when imageUrl is provided', async () => {
        const wrapper = shallow(<PostEmoji {...baseProps}/>);
        await waitForExpect(() => {
            expect(wrapper.state('canSenderAccess')).toBe(true);
        });
        wrapper.update();
        expect(wrapper.find('span').text()).toBe(`:${baseProps.name}:`);
    });

    test('should render original text when imageUrl is empty', () => {
        const props = {
            ...baseProps,
            imageUrl: '',
        };

        const wrapper = shallow(<PostEmoji {...props}/>);

        expect(wrapper.find('span')).toHaveLength(0);
        expect(wrapper.text()).toBe(`:${props.name}:`);
    });
});
