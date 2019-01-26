import React from 'react';

import FilterPanel from './FilterPanel';
import './index.scss';

export default class TextOptionFilterPanel extends FilterPanel {

    constructor(props) {
        super(props);
    }

    renderOptionBlock() {
        const {
            expandable,
        } = this.props;
        const { 
            filteredData, 
            selectOptions,
            expand
        } = this.state;

        return (
            <div className={`option-container text-option-container ${expandable ? 'scroll-container' : ''} ${expand ? 'expand' : ''}`}>
                <div className="option-wrapper">
                    <div className="options">
                        {
                            filteredData.map(item => {
                                const checked = selectOptions[item.name];
                                return (
                                    <div key={item.name} className={`option-item text-option-item ${checked ? 'selected' : ''}`}
                                        title={item.name} >
                                        {/* <span className="check-placeholder"></span>{item.name} */}
                                        <div className="option-item-wrapper" onClick={() => this.selectOption(item)}>
                                            <i className="option-item-check"></i>
                                            <span className="option-item-name">{item.name}</span>
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