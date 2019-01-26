import React from 'react';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

import './index.scss';

const genLetters = () => {
    const letters = [];
    for (let i = "A".charCodeAt(0); i < "Z".charCodeAt(0); i++) {
        letters.push(String.fromCharCode(i));
    }
    return letters;
}

const toArray = (hash, func) => {
    let arr = [];
    for (let key in hash) {
        if (func) arr.push(func(hash[key], key, hash));
        else arr.push(hash[key]);
    }
    return arr;
}

export const SelectionMode = {
    SINGLE: 1,
    MULTI: 2,
};

export const utils = {
    filter,
    toArray,
    isEmpty,
    genLetters,
};

const DEFAULT_STATE = {
    selectedLetter: null,
    selectOptions: {},
    filteredData: null,
    keyword: '',
    data: null,
    expand: false,
    selectionMode: SelectionMode.SINGLE,
};

export default class FilterPanel extends React.Component {

    state = { ...DEFAULT_STATE };

    constructor(props) {
        super(props);
        this.state.data = props.data || [];
        this.state.filteredData = this.state.data;
        if (props.letterSearch) {
            this.state.letters = genLetters();
        }
    }

    componentWillReceiveProps(newProps) {
        let oldData = this.state.data;
        let newData = newProps.data;
        let state = {};
        if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
            state = {
                ...DEFAULT_STATE,
                data: newData,
                filteredData: newData,
            };
        }
        if (this.props.letterSearch !== newProps.letterSearch) {
            state.letters = genLetters();
        }
        if (isEmpty(state)) return;

        this.setState(state);
    }

    selectOption(item) {
        let { selectOptions, selectionMode } = this.state;
        const isSingleMode = selectionMode === SelectionMode.SINGLE;
        if (isSingleMode) {
            selectOptions = {};
        }

        const key = item.name;
        if (selectOptions[key]) {
            delete selectOptions[key];
        } else {
            selectOptions[key] = item;
        }
        const isEmptySelected = isEmpty(selectOptions);
        this.setState({
            selectOptions,
            isEmptySelected,
        }, () => {
            if (isSingleMode) {
                this.submitMultiSelect();
            }
        });
    }

    unselectOption(item) {
        const key = item.name;
        let { selectOptions } = this.state;
        if (selectOptions[key]) {
            delete selectOptions[key];
        } else {
            return;
        }
        const isEmptySelected = isEmpty(selectOptions);
        this.setState({
            selectOptions,
            isEmptySelected,
        });
    }

    onFilterLetter(letter) {
        this.setState({
            selectedLetter: letter,
            filteredData: this.filterLetter(letter),
            keyword: '',
        });
    }

    filterLetter(letter) {
        let { data } = this.state;
        if (!letter) return data;
        let filteredData = filter(data, (item) => {
            return item.letter === letter;
        });
        return filteredData || [];
    }

    onFilterKeyword(keyword) {
        this.setState({
            keyword,
            filteredData: this.filterKeyword(keyword),
            selectedLetter: null,
        });
    }

    filterKeyword(keyword) {
        let { data } = this.state;
        if (!keyword) return data;
        let filteredData = filter(data, (item) => {
            return new RegExp(`${keyword}`, 'img').test(item.name) || new RegExp(`${keyword}`, 'img').test(item.pinyin);
        });
        return filteredData || [];
    }

    toggleExpand() {
        this.setState({
            expand: !this.state.expand,
        });
    }

    toggleMultiSelect() {
        let { selectionMode } = this.state;
        this.setState({
            expand: true,
            selectionMode: selectionMode === SelectionMode.MULTI ? SelectionMode.SINGLE : SelectionMode.MULTI,
        });
    }

    cancelMultiSelect() {
        this.setState({
            expand: false,
            selectOptions: {},
            isEmptySelected: true,
            selectionMode: SelectionMode.SINGLE,
        });
    }

    submitMultiSelect() {
        const { 
            selectOptions, 
            isEmptySelected,
        } = this.state;
        if (isEmptySelected) return;

        let selecteds = toArray(selectOptions);
        
        let { onSelect } = this.props;
        onSelect && onSelect(selecteds);
    }

    renderOptionBlock() {
        return null;
    }

    render() {
        const {
            allowMultiSelect,
            expandable,
        } = this.props;
        const { 
            letters,
            selectedLetter, 
            isEmptySelected,
            filteredData, 
            keyword, 
            selectionMode,
            expand 
        } = this.state;
        const isMultiMode = allowMultiSelect ? (selectionMode === SelectionMode.MULTI) : false;

        if (!filteredData) return null;

        return (
            <div className={`option-group-filter ${expand ?  'expand' : ''}`}>
                {
                    expand ? 
                    <div className="option-filter-search">
                        <input type="text" placeholder="可搜拼音、汉字查找品牌" value={keyword} onChange={ evt => this.onFilterKeyword(evt.currentTarget.value) } />
                    </div> : null
                }
                {
                    expand && letters ? 
                    <div className="letter-nav">
                        <span className={`letter letter-all ${selectedLetter ? '' : 'selected'}`} onClick={() => { this.onFilterLetter(null) }}>所有品牌 <i className="icon-letter"></i></span>
                        {
                            letters.map(letter => {
                                return <span key={letter} className={`letter ${selectedLetter === letter ? 'selected' : ''}`} onClick={() => { this.onFilterLetter(letter) }}>{letter} <i className="icon-letter"></i></span>
                            })
                        }
                    </div> : null
                }
                { this.renderOptionBlock() }
                {
                    isMultiMode ? 
                    <div className="selection-submit item-btns">
                        <span className={`btn b-sure ${isEmptySelected ? 'disabled' : ''}`} onClick={ () => this.submitMultiSelect() } >确定</span>
                        <span className="btn b-cancel" onClick={ () => this.cancelMultiSelect() } >取消</span>
                    </div> : null
                }
                {
                    !isMultiMode ? 
                    <div className="more-tools">
                        {
                            expandable ? 
                            <div className="tool-btn more-btn" onClick={ () => this.toggleExpand() }>{ !expand ? '更多' : '收起' }<i></i></div>: null
                        }
                        {
                            allowMultiSelect ? 
                            <div className="tool-btn multi-select-btn" onClick={ () => this.toggleMultiSelect() }>多选<i></i></div> : null
                        }
                    </div>
                     : null
                }
            </div>
        );
    }
}