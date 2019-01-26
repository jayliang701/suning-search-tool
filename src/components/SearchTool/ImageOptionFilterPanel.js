import React from 'react';

import FilterPanel from './FilterPanel';
import './index.scss';

export default class ImageOptionFilterPanel extends FilterPanel {

    constructor(props) {
        super(props);
    }

    renderOptionBlock() {
        const { 
            filteredData, 
            selectOptions,
        } = this.state;

        return (
            <div className="option-container scroll-container">
                <div className="option-wrapper">
                    <ul className="options">
                        {
                            filteredData.map(item => {
                                return (
                                    <li key={item.name} className={`option-item img-option-item ${selectOptions[item.name] ? 'selected' : ''}`}
                                        title={item.name} >
                                        <div className="option-item-frame"></div>
                                        <div className="option-item-wrapper" onClick={() => this.selectOption(item)}>
                                            {
                                                item.img ? <img src={item.img} alt={item.name} /> :
                                                    <span className="option-item-name">{item.name}</span>
                                            }
                                        </div>
                                        <span className="close" onClick={() => this.unselectOption(item)}><i></i></span>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}