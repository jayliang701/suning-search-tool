import React from 'react';

import FilterPanel from './FilterPanel';
import './index.scss';

export default class TextOptionFilterPanel extends FilterPanel {

    constructor(props) {
        super(props);
    }

    renderOptionBlock() {
        const { 
            filteredData, 
            selectOptions,
        } = this.state;

        return (
            <div className="option-container">
                <div className="option-wrapper">
                    <div className="options">
                        {
                            filteredData.map(item => {
                                return (
                                    <div key={item.name} className={`option-item text-option-item ${selectOptions[item.name] ? 'selected' : ''}`}
                                        title={item.name} >
                                        {item.name}
                                        <div className="option-item-wrapper" onClick={() => this.selectOption(item)}>
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