import React from 'react';

import axios from 'axios';
import TextOptionFilterPanel from './TextOptionFilterPanel';
import ImageOptionFilterPanel from './ImageOptionFilterPanel';

import './index.scss';

const RENDER_MODE = {
    TEXT: "text",
    IMAGE: "img"
};

class SearchTool extends React.Component {

    state = {
        config: [],
        filter: {
            keyword: '',
            brands: [],
        }
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

    render() {
        const { config } = this.state;

        return (
            <div className="search-tool">
                {
                    config.map(group => {
                        group.render = group.render || RENDER_MODE.TEXT;

                        let Panel = TextOptionFilterPanel;
                        if (group.render === RENDER_MODE.IMAGE) {
                            Panel = ImageOptionFilterPanel;
                        }
                        return (
                            <div key={group.key} className="option-group">
                                <div className="option-group-name">
                                    <label>{group.label}</label>
                                </div>
                                <Panel
                                    data={group.data}
                                    allowMultiSelect={group.allowMultiSelect}
                                    letterSearch={group.letterSearch}
                                    expandable={group.expandable} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

}

export default SearchTool;