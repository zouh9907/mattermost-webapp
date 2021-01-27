// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Emoji} from 'mattermost-redux/constants';

import LoadingScreen from 'components/loading_screen';
import SaveButton from 'components/save_button';
import EmojiListItem from 'components/emoji/emoji_list_item';
import NextIcon from 'components/widgets/icons/fa_next_icon';
import PreviousIcon from 'components/widgets/icons/fa_previous_icon';
import SearchIcon from 'components/widgets/icons/fa_search_icon';
import LocalizedInput from 'components/localized_input/localized_input';

import {t} from 'utils/i18n.jsx';

const EMOJI_PER_PAGE = 50;
const EMOJI_SEARCH_DELAY_MILLISECONDS = 200;

export default class EmojiList extends React.PureComponent {
    static propTypes = {

        /**
         * Custom emojis on the system.
         */
        //emojiIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        userId: PropTypes.string.isRequired,

        /**
         * Function to scroll list to top.
         */
        scrollToTop: PropTypes.func.isRequired,

        actions: PropTypes.shape({

            /**
             * Get pages of custom emojis.
             */
            getCustomEmojis: PropTypes.func.isRequired,

            /**
             * Search custom emojis.
             */
            searchCustomEmojis: PropTypes.func.isRequired,

            /**
             * Get pages of private emojis.
             */
            getPrivateEmojis: PropTypes.func.isRequired,

            /**
             * Search private emojis.
             */
            searchPrivateEmojis: PropTypes.func.isRequired,
        }).isRequired,
        isPrivate: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);

        this.searchTimeout = null;

        this.state = {
            loading: true,
            page: 0,
            nextLoading: false,
            searchEmojis: null,
            missingPages: true,
            emojiIds: [],
        };
    }

    componentDidMount() {
        if (this.props.isPrivate) {
            this.props.actions.getPrivateEmojis(0, EMOJI_PER_PAGE + 1, Emoji.SORT_BY_NAME, this.props.userId).then(({data}) => {
                this.setState({loading: false});
                if (data && data.length < EMOJI_PER_PAGE) {
                    this.setState({
                        missingPages: false,
                        emojiIds: data.map(({id}) => id),
                    });
                }
            });
        } else {
            this.props.actions.getCustomEmojis(0, EMOJI_PER_PAGE + 1, Emoji.SORT_BY_NAME, true).then(({data}) => {
                this.setState({loading: false});
                if (data && data.length < EMOJI_PER_PAGE) {
                    this.setState({
                        missingPages: false,
                        emojiIds: data.map(({id}) => id),
                    });
                }
            });
        }
    }

    nextPage = (e) => {
        if (e) {
            e.preventDefault();
        }

        const next = this.state.page + 1;
        this.setState({nextLoading: true});
        if (this.props.isPrivate) {
            this.props.actions.getPrivateEmojis(next, EMOJI_PER_PAGE, Emoji.SORT_BY_NAME, this.props.userId).then(({data}) => {
                this.setState({page: next, nextLoading: false});
                if (data && data.length < EMOJI_PER_PAGE) {
                    this.setState({
                        missingPages: false,
                        emojiIds: data.map(({id}) => id),
                    });
                }

                this.props.scrollToTop();
            });
        } else {
            this.props.actions.getCustomEmojis(next, EMOJI_PER_PAGE, Emoji.SORT_BY_NAME, true).then(({data}) => {
                this.setState({page: next, nextLoading: false});
                if (data && data.length < EMOJI_PER_PAGE) {
                    this.setState({
                        missingPages: false,
                        emojiIds: data.map(({id}) => id),
                    });
                }

                this.props.scrollToTop();
            });
        }
    }

    previousPage = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.setState({page: this.state.page - 1, nextLoading: false});
        this.props.scrollToTop();
    }

    onSearchChange = (e) => {
        if (!e || !e.target) {
            return;
        }

        const term = e.target.value || '';

        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            if (term.trim() === '') {
                this.setState({searchEmojis: null, page: 0});
                return;
            }

            this.setState({loading: true});

            let response;
            if (this.props.isPrivate) {
                response = await this.props.actions.searchPrivateEmojis(term, {}, this.props.userId);
            } else {
                response = await this.props.actions.searchCustomEmojis(term, {}, true);
            }

            const {data} = response;
            if (data) {
                this.setState({searchEmojis: data.map((em) => em.id), loading: false});
            } else {
                this.setState({searchEmojis: [], loading: false});
            }
        }, EMOJI_SEARCH_DELAY_MILLISECONDS);
    }

    onDeleteEmoji = (emojiId) => {
        this.deleteFromSearch(emojiId);
        this.deleteFromIds(emojiId);
    }

    deleteFromSearch = (emojiId) => {
        if (!this.state.searchEmojis) {
            return;
        }

        this.setState({searchEmojis: this.state.searchEmojis.filter((id) => id !== emojiId)});
    }

    deleteFromIds =(emojiId) => {
        if (!this.state.emojiIds) {
            return;
        }

        this.setState({emojiIds: this.state.emojiIds.filter((id) => id !== emojiId)});
    }

    render() {
        const searchEmojis = this.state.searchEmojis;
        const emojis = [];
        let nextButton;
        let previousButton;

        if (this.state.loading) {
            emojis.push(
                <tr
                    key='loading'
                    className='backstage-list__item backstage-list__empty'
                >
                    <td colSpan='4'>
                        <LoadingScreen key='loading'/>
                    </td>
                </tr>,
            );
        } else if (this.state.emojiIds.length === 0 || (searchEmojis && searchEmojis.length === 0)) {
            if (this.props.isPrivate) {
                emojis.push(
                    <tr
                        key='empty'
                        className='backstage-list__item backstage-list__empty'
                    >
                        <td colSpan='4'>
                            <FormattedMessage
                                id='emoji_list.empty_private'
                                defaultMessage='No private emoji found'
                            />
                        </td>
                    </tr>,
                );
            } else {
                emojis.push(
                    <tr
                        key='empty'
                        className='backstage-list__item backstage-list__empty'
                    >
                        <td colSpan='4'>
                            <FormattedMessage
                                id='emoji_list.empty'
                                defaultMessage='No public emoji found'
                            />
                        </td>
                    </tr>,
                );
            }
        } else if (searchEmojis) {
            searchEmojis.forEach((emojiId) => {
                emojis.push(
                    <EmojiListItem
                        key={'emoji_search_item' + emojiId}
                        emojiId={emojiId}
                        onDelete={this.onDeleteEmoji}
                        isPrivate={this.props.isPrivate}
                    />,
                );
            });
        } else {
            const pageStart = this.state.page * EMOJI_PER_PAGE;
            const pageEnd = pageStart + EMOJI_PER_PAGE;
            const emojisToDisplay = this.state.emojiIds.slice(pageStart, pageEnd);

            emojisToDisplay.forEach((emojiId) => {
                emojis.push(
                    <EmojiListItem
                        key={'emoji_list_item' + emojiId}
                        emojiId={emojiId}
                        isPrivate={this.props.isPrivate}
                        onDelete={this.onDeleteEmoji}
                    />,
                );
            });

            if (this.state.missingPages) {
                const buttonContents = (
                    <span>
                        <FormattedMessage
                            id='filtered_user_list.next'
                            defaultMessage='Next'
                        />
                        <NextIcon additionalClassName='ml-2'/>
                    </span>
                );

                nextButton = (
                    <SaveButton
                        btnClass='btn-link'
                        extraClasses='pull-right'
                        onClick={this.nextPage}
                        saving={this.state.nextLoading}
                        disabled={this.state.nextLoading}
                        defaultMessage={buttonContents}
                        savingMessage={buttonContents}
                    />
                );
            }

            if (this.state.page > 0) {
                previousButton = (
                    <button
                        className='btn btn-link'
                        onClick={this.previousPage}
                    >
                        <PreviousIcon additionalClassName='mr-2'/>
                        <FormattedMessage
                            id='filtered_user_list.prev'
                            defaultMessage='Previous'
                        />
                    </button>
                );
            }
        }

        if (this.props.isPrivate) {
            return (
                <div>
                    <div className='backstage-filters'>
                        <div className='backstage-filter__search'>
                            <SearchIcon/>
                            <LocalizedInput
                                type='search'
                                className='form-control'
                                placeholder={{id: t('emoji_list.search-private'), defaultMessage: 'Search Private Emoji'}}
                                onChange={this.onSearchChange}
                                style={style.search}
                            />
                        </div>
                    </div>
                    <span className='backstage-list__help'>
                        <p>
                            <FormattedMessage
                                id='emoji_list.help'
                                defaultMessage="Private emoji are only available to the ones that upload or save them. Type ':' followed by two characters in a message box to bring up the emoji selection menu."
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id='emoji_list.help2'
                                defaultMessage="Tip: If you add #, ##, or ### as the first character on a new line containing emoji, you can use larger sized emoji. To try it out, send a message such as: '# :smile:'."
                            />
                        </p>
                    </span>
                    <div className='backstage-list'>
                        <table className='emoji-list__table'>
                            <thead>
                                <tr className='backstage-list__item emoji-list__table-header'>
                                    <th className='emoji-list__name'>
                                        <FormattedMessage
                                            id='emoji_list.name'
                                            defaultMessage='Name'
                                        />
                                    </th>
                                    <th className='emoji-list__image'>
                                        <FormattedMessage
                                            id='emoji_list.image'
                                            defaultMessage='Image'
                                        />
                                    </th>
                                    <th className='emoji-list__creator'>
                                        <FormattedMessage
                                            id='emoji_list.creator'
                                            defaultMessage='Creator'
                                        />
                                    </th>
                                    <th className='emoji-list_actions'>
                                        <FormattedMessage
                                            id='emoji_list.actions'
                                            defaultMessage='Actions'
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {emojis}
                            </tbody>
                        </table>
                    </div>
                    <div className='filter-controls pt-3'>
                        {previousButton}
                        {nextButton}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className='backstage-filters'>
                    <div className='backstage-filter__search'>
                        <SearchIcon/>
                        <LocalizedInput
                            type='search'
                            className='form-control'
                            placeholder={{id: t('emoji_list.search'), defaultMessage: 'Search Public Emoji'}}
                            onChange={this.onSearchChange}
                            style={style.search}
                        />
                    </div>
                </div>
                <span className='backstage-list__help'>
                    <p>
                        <FormattedMessage
                            id='emoji_list.help'
                            defaultMessage="Public emoji are available to everyone on your server. Type ':' followed by two characters in a message box to bring up the emoji selection menu."
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id='emoji_list.help2'
                            defaultMessage="Tip: If you add #, ##, or ### as the first character on a new line containing emoji, you can use larger sized emoji. To try it out, send a message such as: '# :smile:'."
                        />
                    </p>
                </span>
                <div className='backstage-list'>
                    <table className='emoji-list__table'>
                        <thead>
                            <tr className='backstage-list__item emoji-list__table-header'>
                                <th className='emoji-list__name'>
                                    <FormattedMessage
                                        id='emoji_list.name'
                                        defaultMessage='Name'
                                    />
                                </th>
                                <th className='emoji-list__image'>
                                    <FormattedMessage
                                        id='emoji_list.image'
                                        defaultMessage='Image'
                                    />
                                </th>
                                <th className='emoji-list__creator'>
                                    <FormattedMessage
                                        id='emoji_list.creator'
                                        defaultMessage='Creator'
                                    />
                                </th>
                                <th className='emoji-list_actions'>
                                    <FormattedMessage
                                        id='emoji_list.actions'
                                        defaultMessage='Actions'
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {emojis}
                        </tbody>
                    </table>
                </div>
                <div className='filter-controls pt-3'>
                    {previousButton}
                    {nextButton}
                </div>
            </div>
        );
    }
}

const style = {
    search: {flexGrow: 0, flexShrink: 0},
};
