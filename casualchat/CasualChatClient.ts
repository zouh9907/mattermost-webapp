// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Emoji, CustomEmoji} from 'mattermost-redux/types/emojis';
import {Client4} from 'mattermost-redux/client';
import FormData from 'form-data';
import {buildQueryString} from 'mattermost-redux/utils/helpers';
import {isCustomEmoji} from 'mattermost-redux/utils/emoji_utils';

function getPrivateEmojisRoute() {
    return `${Client4.getEmojisRoute()}/private`;
}

export async function createPrivateEmoji(emoji: CustomEmoji, imageData: File): Promise<any> {
    Client4.trackEvent('api', 'api_emoji_custom_add_private');

    const formData = new FormData();
    formData.append('image', imageData);
    formData.append('emoji', JSON.stringify(emoji));
    const request: any = {
        method: 'post',
        body: formData,
    };

    if (formData.getBoundary) {
        request.headers = {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        };
    }

    return Client4.doFetch<CustomEmoji>(
        getPrivateEmojisRoute(),
        request,
    );
}

export function getEmojiUrlByUser(userid: string, emoji: Emoji): string {
    if (isCustomEmoji(emoji)) {
        const url = `${Client4.getEmojiRoute(emoji.id)}/privateimage${buildQueryString({userid})}`;
        return url;
    }

    const filename = emoji.filename || emoji.aliases[0];
    return Client4.getSystemEmojiImageUrl(filename);
}

export async function getPrivateEmojis(userID: string, page: number, perPage: number, sort: string): Promise<Emoji[]> {
    return Client4.doFetch<Emoji[]>(
        `${getPrivateEmojisRoute()}${buildQueryString({page, per_page: perPage, sort})}`,
        {method: 'get'},
    );
}

export async function searchPrivateEmoji(userID: string, term: string, options = {}): Promise<Emoji[]> {
    //TODO: After backend is finished
    // return Client4.doFetch<CustomEmoji[]>(
    //     `${Client4.getEmojisRoute()}/search`,
    //     {method: 'post', body: JSON.stringify({term, ...options})},
    // );
    //console.log('userId =', userID);
    //console.log('term =', term);
    //console.log('options =', options);
    if (userID && term && options) {
        //pass linter
    }
    return Promise.resolve([]);
}

export async function checkEmojiAccess(userid: string, emoji: Emoji|undefined): Promise<boolean> {
    if (emoji === undefined) {
        return false;
    }
    if (isCustomEmoji(emoji)) {
        const url = `${Client4.getEmojiRoute(emoji.id)}/checkprivate${buildQueryString({userid})}`;
        return Client4.doFetch<boolean>(
            url,
            {method: 'get'},
        );
    }
    return true;
}

export async function savePrivateEmoji(userid: string, emoji: Emoji|undefined): Promise<any> {
    if (emoji !== undefined && isCustomEmoji(emoji)) {
        const url = `${Client4.getEmojiRoute(emoji.id)}/save${buildQueryString({userid})}`;
        await Client4.doFetch<any>(
            url,
            {method: 'post'},
        );
    }
}

export default {createPrivateEmoji, getEmojiUrlByUser, getPrivateEmojis, searchPrivateEmoji, checkEmojiAccess, savePrivateEmoji};
