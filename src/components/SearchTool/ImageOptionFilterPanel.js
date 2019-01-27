import React from 'react';

import FilterPanel, { utils } from './FilterPanel';
import './index.scss';

export default class ImageOptionFilterPanel extends FilterPanel {

    constructor(props) {
        super(props);
    }

    renderConfirmBlock() {
        const { isEmptySelected, selectOptions } = this.state;
        const selecteds = utils.toArray(selectOptions);
        if (selecteds.length < 1) {
            return super.renderConfirmBlock();
        }
        return (
            <div className="multi-select-confirm-block">
                <div class="item-selected">
                    <label>已选条件</label>
                    <div className="item-selected-items">
                        {
                            selecteds.map(item => {
                                return (
                                    <div className="item-selected-item" onClick={ () => this.unselectOption(item) }><i></i>{item.name}</div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="selection-submit item-btns">
                    <span className={`btn b-sure ${isEmptySelected ? 'disabled' : ''}`} onClick={ () => this.submitMultiSelect() } >确定</span>
                    <span className="btn b-cancel" onClick={ () => this.cancelMultiSelect() } >取消</span>
                </div>
            </div>
        );
    }

    renderOptionBlock() {
        const {
            expandable,
        } = this.props;
        const { 
            filteredData, 
            selectOptions,
            expand,
        } = this.state;

        return (
            <div className={`option-container img-option-container ${expandable ? 'scroll-container' : ''} ${expand ? 'expand' : ''}`}>
                <div className="option-wrapper">
                    <ul className="options">
                        {
                            filteredData.map(item => {
                                const checked = selectOptions[item.name];
                                return (
                                    <li key={item.name} className={`option-item img-option-item ${checked ? 'selected' : ''}`}
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