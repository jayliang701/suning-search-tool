import React from 'react';

import axios from 'axios';
import TextOptionFilterPanel from './TextOptionFilterPanel';
import ImageOptionFilterPanel from './ImageOptionFilterPanel';

import './index.scss';
import TabOptionFilterPanel from './TabOptionFilterPanel';

const RENDER_MODE = {
    TEXT: "text",
    IMAGE: "img",
    TAB: "tab"
};

class SearchTool extends React.Component {

    state = {
        config: [],
        filter: {}
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        let res = await axios.get(window.Setting.cdn + '/static/config/filter_config.json');
        this.setState({
            config: res.data,
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            filter: newProps.filter || {},
        });
    }

    filterOptionChange(groupKey, selecteds) {

        let { filter } = this.state;
        filter = filter || {};
        filter[groupKey] = selecteds;

        this.setState({
            filter
        }, () => {
            const { onSearch } = this.props;
            onSearch && onSearch(filter);
        });

    }

    render() {
        const { config, filter } = this.state;

        return (
            <div className="search-tool">
                {
                    config.map(group => {
                        if (filter[group.key]) return;

                        group.render = group.render || RENDER_MODE.TEXT;

                        let Panel = TextOptionFilterPanel;
                        if (group.render === RENDER_MODE.IMAGE) {
                            Panel = ImageOptionFilterPanel;
                        } else if (group.render === RENDER_MODE.TAB) {
                            Panel = TabOptionFilterPanel;
                        }
                        return (
                            <div key={group.key} className="option-group">
                                <div className="option-group-name">
                                    <label>{group.label}</label>
                                </div>
                                <Panel group={group.key} {...group} onSelect={ selecteds => this.filterOptionChange(group.key, selecteds) } />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

}

export default SearchTool;