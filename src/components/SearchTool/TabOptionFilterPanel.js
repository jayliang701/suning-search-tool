import React from 'react';

import html from '../../utils/html';

import FilterPanel, { utils, DEFAULT_STATE } from './FilterPanel';
import './index.scss';

export default class TabOptionFilterPanel extends FilterPanel {

    constructor(props) {
        super(props);
        this.state.tabOptionMultiSelect = {};
        this.state.selectedTabOptions = {};
        this.state.isEmptyTabOptionSelected = {};
    }

    dataUpdated() {
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.updateLayout();
        }, 20);
    }

    clearFilter() {
        const data = this.props.data || [];
        this.setState({
            ...DEFAULT_STATE,
            data,
            filteredData: data,
            tabOptionMultiSelect: {},
            selectedTabOptions: {},
            isEmptyTabOptionSelected: {},
        });
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    toggleTabOptionMultiSelect(tabIndex) {
        const status = this.state.tabOptionMultiSelect || {};
        status[tabIndex] = !status[tabIndex];
        this.setState({
            tabOptionMultiSelect: status,
        });
    }

    cancelTabOptionMultiSelect(tabIndex) {
        const status = this.state.tabOptionMultiSelect || {};
        delete status[tabIndex];
        this.setState({
            selectedTabOptions: {},
            isEmptyTabOptionSelected: true,
            tabOptionMultiSelect: status,
        });
    }

    selectTabOption(tabIndex, tabOption) {
        let { selectedTabOptions, isEmptyTabOptionSelected, tabOptionMultiSelect } = this.state;

        isEmptyTabOptionSelected  = isEmptyTabOptionSelected || {};
        selectedTabOptions[tabIndex] = selectedTabOptions[tabIndex] || {};
        
        let tabSelectedTabOptions = selectedTabOptions[tabIndex];

        const key = tabOption.name;
        if (tabSelectedTabOptions[key]) {
            delete tabSelectedTabOptions[key];
        } else {
            tabSelectedTabOptions[key] = tabOption;
        }
        isEmptyTabOptionSelected[tabIndex] = utils.isEmpty(tabSelectedTabOptions);
        this.setState({
            selectedTabOptions,
            isEmptyTabOptionSelected,
        }, () => {
            const tabTabOptionMultiSelect = tabOptionMultiSelect[tabIndex];
            if (!tabTabOptionMultiSelect) {
                // single select
                this.submitTabOptionMultiSelect(tabIndex);
            }
        });
    }

    submitTabOptionMultiSelect(tabIndex) {
        let { filteredData, selectedTabOptions } = this.state;
        let tabItem = filteredData[tabIndex];

        this.clearFilter();

        const { onSelect } = this.props;
        const item = {
            ...tabItem,
            options: utils.toArray(selectedTabOptions[tabIndex] || {}),
        };
        delete item['data'];

        onSelect && onSelect([
            item
        ]);
    }

    updateLayout() {
        const { group } = this.props;

        let comp = html.query(`.${group}-group`);

        let tabs = comp.find('.option-item-wrapper-overlay');
        let firstTab;
        tabs.each((index, ele) => {
            if (index === 0) {
                firstTab = ele;
                return;
            }

            let rect1 = firstTab.getBoundingClientRect();
            let rect2 = ele.getBoundingClientRect();
            ele = html.query(ele);
            
            let panel = ele.parent().find('.option-tab-panel')[0];
            let offset = Math.round(rect2.left - rect1.left);
            panel.style['margin-left'] = -offset + 'px';
        });
    }

    renderOptionBlock() {
        const {
            expandable,
        } = this.props;
        const { 
            tabOptionMultiSelect,
            selectedTabOptions,
            isEmptyTabOptionSelected,
            filteredData, 
            selectOptions,
            expand,
        } = this.state;

        return (
            <div className={`option-container tab-option-container ${expandable ? 'scroll-container' : ''} ${expand ? 'expand' : ''}`} >
                <div className="option-wrapper">
                    <div className="options">
                        {
                            filteredData.map((item, i) => {
                                const checked = selectOptions[item.name];
                                const tabData = item.data;
                                const tabSelectedTabOptions = selectedTabOptions[i] || {};
                                const tabIsEmptyTabOptionSelected = isEmptyTabOptionSelected[i];
                                const tabTabOptionMultiSelect = tabOptionMultiSelect[i];
                                return (
                                    <div key={item.name} className={`option-item text-option-item ${checked ? 'selected' : ''}`}
                                        title={item.name} >
                                        <div className="option-item-wrapper">
                                            <span className="option-item-name">{item.name}</span>
                                            <i className="icon-down"></i>
                                        </div>
                                        <div className="option-item-wrapper-overlay">
                                            <span className="option-item-name">{item.name}</span>
                                            <i className="icon-down"></i>
                                        </div>
                                        <div className="option-tab-panel">
                                            <div className="option-tab-panel-wrapper">
                                                {
                                                    tabData.map(tabItem => {
                                                        const isSelected = tabSelectedTabOptions[tabItem.name];
                                                        return (
                                                            <span key={tabItem.name} className={`option-tab-item ${isSelected ? 'selected' : ''}`} onClick={ () => this.selectTabOption(i, tabItem) }>
                                                                { tabTabOptionMultiSelect ? <i className="tab-option-item-check"></i> : null }
                                                                {tabItem.name}
                                                            </span>
                                                        );
                                                    })
                                                }
                                            </div>
                                            { 
                                                tabTabOptionMultiSelect ? null :
                                                <div className="multi-select-btn" onClick={ () => this.toggleTabOptionMultiSelect(i) }>多选<i></i></div>
                                            }
                                            {
                                                tabTabOptionMultiSelect ? 
                                                <div className="selection-submit item-btns">
                                                    <span className={`btn b-sure ${tabIsEmptyTabOptionSelected ? 'disabled' : ''}`} onClick={ () => this.submitTabOptionMultiSelect(i) } >确定</span>
                                                    <span className="btn b-cancel" onClick={ () => this.cancelTabOptionMultiSelect(i) } >取消</span>
                                                </div> : null
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}