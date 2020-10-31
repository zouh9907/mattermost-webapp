import {bindClientFunc, forceLogoutIfNecessary} from 'mattermost-redux/actions/helpers';
import {Client4} from 'mattermost-redux/client';
import CasualChatClient from 'casualchat/CasualChatClient';
import {EmojiTypes} from 'mattermost-redux/action_types';
import {GetStateFunc, DispatchFunc, ActionFunc, ActionResult} from 'mattermost-redux/types/actions';
import {General, Emoji} from 'mattermost-redux/constants';
import {getProfilesByIds} from 'mattermost-redux/actions/users';
import {logError} from 'mattermost-redux/actions/errors';


export function createPrivateEmoji(emoji: any, image: any): ActionFunc {
    return bindClientFunc({
        clientFunc: CasualChatClient.createPrivateEmoji,
        onSuccess: EmojiTypes.RECEIVED_CUSTOM_EMOJI,
        params: [
            emoji,
            image,
        ],
    });
}


export function getPrivateEmojis(
    page = 0,
    perPage: number = General.PAGE_SIZE_DEFAULT,
    sort: string = Emoji.SORT_BY_NAME,
    loadUsers = false,
    userID: string,
): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let data;
        try {
            data = await CasualChatClient.getPrivateEmojis(userID, page, perPage, sort);
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);

            dispatch(logError(error));
            return {error};
        }

        // if (loadUsers) {
        //     dispatch(loadProfilesForPrivEmojis(data));
        // }

        dispatch({
            type: EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
            data,
        });

        return {data};
    };
}

export function searchPrivateEmojis(term: string, options: any = {}, loadUsers = false, userID:string): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let data;
        try {
            data = await CasualChatClient.searchPrivateEmoji(userID, term, options);
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);

            dispatch(logError(error));
            return {error};
        }

        // if (loadUsers) {
        //     dispatch(loadProfilesForCustomEmojis(data));
        // }

        dispatch({
            type: EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
            data,
        });

        return {data};
    };
}