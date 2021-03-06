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

const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
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
    cloneObject,
};

export const DEFAULT_STATE = {
    selectedLetter: null,
    selectOptions: {},
    filteredData: null,
    keyword: '',
    data: null,
    expand: false,
    isEmptySelected: true,
    selectionMode: SelectionMode.SINGLE,
};

export default class FilterPanel extends React.Component {

    state = cloneObject(DEFAULT_STATE);

    constructor(props) {
        super(props);
        this.state.data = props.data || [];
        this.state.filteredData = this.state.data;
        if (props.letterSearch) {
            this.state.letters = genLetters();
        }
    }

    componentDidMount() {
        this.dataUpdated();
        const { onRegister, group } = this.props;
        onRegister && onRegister(this, group);
    }

    componentWillUnmount() {
        const { onDispose, group } = this.props;
        onDispose && onDispose(this, group);
    }

    componentWillReceiveProps(newProps) {
        let oldData = this.state.data;
        let newData = newProps.data;
        let state = {};
        let func;
        if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
            state = {
                ...cloneObject(DEFAULT_STATE),
                data: newData,
                filteredData: newData,
            };
            func = this.dataUpdated.bind(this);
        }
        if (this.props.letterSearch !== newProps.letterSearch) {
            state.letters = newProps.letterSearch ? genLetters() : null;
        }
        if (isEmpty(state)) return;

        this.setState(state, func);
    }

    dataUpdated() {

    }

    clearFilter(stopNotify) {
        const data = this.props.data || [];
        const state = {
            ...cloneObject(DEFAULT_STATE),
            data,
            filteredData: data,
        };
        console.log(this.props.group, state)
        this.setState(state, () => {   
            if (stopNotify) return;
            const { onCollapse, group } = this.props;
            onCollapse && onCollapse(this, group);
        });
    }

    selectOption(item) {
        let { selectOptions, selectionMode } = this.state;
        const isSingleMode = selectionMode === SelectionMode.SINGLE;
        if (isSingleMode) {

            this.clearFilter();

            let { onSelect, group } = this.props;
            return onSelect && onSelect([ item ], group);
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
        }, () => {
            let { expand } = this.state;
            const { onExpand, onCollapse, group } = this.props;
            if (expand) onExpand && onExpand(this, group);
            else onCollapse && onCollapse(this, group);
        });
    }

    toggleMultiSelect() {
        let { selectionMode } = this.state;
        this.setState({
            expand: true,
            selectionMode: selectionMode === SelectionMode.MULTI ? SelectionMode.SINGLE : SelectionMode.MULTI,
        }, () => {
            const { onExpand, group } = this.props;
            onExpand && onExpand(this, group);
        });
    }

    cancelMultiSelect() {
        this.setState({
            expand: false,
            selectOptions: {},
            isEmptySelected: true,
            selectionMode: SelectionMode.SINGLE,
        }, () => {
            const { onCollapse, group } = this.props;
            onCollapse && onCollapse(this, group);
        });
    }

    submitMultiSelect() {
        const { 
            selectOptions, 
            isEmptySelected,
        } = this.state;
        if (isEmptySelected) return;

        this.clearFilter();

        let selecteds = toArray(selectOptions);
        
        let { onSelect, group } = this.props;
        onSelect && onSelect(selecteds, group);
    }

    reset(force) {
        if (!force && !this.state.expand) return;
        this.clearFilter(true);
    }

    renderConfirmBlock() {
        const { isEmptySelected } = this.state;
        return (
            <div className="selection-submit item-btns">
                <span className={`btn b-sure ${isEmptySelected ? 'disabled' : ''}`} onClick={ () => this.submitMultiSelect() } >确定</span>
                <span className="btn b-cancel" onClick={ () => this.cancelMultiSelect() } >取消</span>
            </div>
        );
    }

    renderOptionBlock() {
        return null;
    }

    render() {
        const {
            group,
            allowMultiSelect,
            expandable,
            keywordSearch,
        } = this.props;
        const { 
            letters,
            selectedLetter, 
            filteredData, 
            keyword, 
            selectionMode,
            expand 
        } = this.state;
        const isMultiMode = allowMultiSelect ? (selectionMode === SelectionMode.MULTI) : false;

        if (!filteredData) return null;

        return (
            <div className={`option-group-filter ${group}-group ${expand ?  'expand' : ''}`}>
                {
                    expand && keywordSearch ? 
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
                    this.renderConfirmBlock() : null
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