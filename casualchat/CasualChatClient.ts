import {Emoji, SystemEmoji, CustomEmoji} from 'mattermost-redux/types/emojis';
import {Client4} from 'mattermost-redux/client';
import FormData from 'form-data';
import {buildQueryString} from 'mattermost-redux/utils/helpers';

const PER_PAGE_DEFAULT = 60;

export async function createPrivateEmoji(emoji: CustomEmoji, imageData: File): Promise<any> {
    Client4.trackEvent('api', 'api_emoji_custom_add_private');

    const formData = new FormData();
    // formData.append('userID',userID);
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
    // console.log(userID);
    console.log(emoji);
    console.log(imageData);
    // return Client4.doFetch<CustomEmoji>(
    //     `????`,
    //     request,
    // );
    return Promise.resolve("");
};

export async function getEmojiUrlByUser(userID: string, emoji: Emoji): Promise<string>{
    console.log(userID);
    console.log(emoji);
    return Promise.resolve("");
}

export async function getAllEmojisByUser(userID:string): Promise<Emoji[]>{
    const allEmojis:Emoji[] = [];
    console.log(userID);
    return Promise.resolve(allEmojis);
}

export async function getPrivateEmojis(userID: string, page: Number, perPage: Number, sort: string): Promise<Emoji[]> {
    // return Client4.doFetch<CustomEmoji[]>(
    //     `${Client4.getEmojisRoute()}${buildQueryString({page, per_page: perPage, sort})}`,
    //     {method: 'get'},
    // );
    console.log("userId =", userID);
    console.log("page =", page);
    console.log("perPage =", perPage);
    console.log("sort =", sort);

    return Promise.resolve([]);
};

export async function searchPrivateEmoji (userID: string, term: string, options = {}): Promise<Emoji[]> {
    // return Client4.doFetch<CustomEmoji[]>(
    //     `${Client4.getEmojisRoute()}/search`,
    //     {method: 'post', body: JSON.stringify({term, ...options})},
    // );
    console.log("userId =", userID);
    console.log("term =", term);
    console.log("options =", options);
    return Promise.resolve([]);
};



export default {createPrivateEmoji, getEmojiUrlByUser, getAllEmojisByUser, getPrivateEmojis, searchPrivateEmoji};