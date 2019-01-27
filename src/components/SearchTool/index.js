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

    panels = {};

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

    onRegisterPanel(panel, groupKey) {
        this.panels[groupKey] = panel;
    }

    onDisposePanel(panel, groupKey) {
        delete this.panels[groupKey];
    }

    onPanelExpand(panel, groupKey) {
        for (let key in this.panels) {
            let p = this.panels[key];
            if (key === groupKey) continue;
            p.reset();
        }
    }

    onPanelCollapse(panel, groupKey) {
        
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
                                <Panel
                                    group={group.key} 
                                    {...group} 
                                    onSelect={ selecteds => this.filterOptionChange(group.key, selecteds) } 
                                    onRegister={ this.onRegisterPanel.bind(this) }
                                    onDispose={ this.onDisposePanel.bind(this) }
                                    onExpand={ this.onPanelExpand.bind(this) }
                                    onCollapse={ this.onPanelCollapse.bind(this) }
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

}

export default SearchTool;