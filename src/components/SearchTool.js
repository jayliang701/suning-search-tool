import React from 'react';
import filter from 'lodash/filter';

import './SearchTool.scss';
import axios from 'axios';

const LETTERS = [];
for (let i = "A".charCodeAt(0); i < "Z".charCodeAt(0); i++) {
    LETTERS.push(String.fromCharCode(i));
}

class LetterSearchPanel extends React.Component {

    state = {
        selectedLetter: null,
        selectBrands: {},
        filteredData: null,
        keyword: '',
        data: null,
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        let res = await axios.get(window.Setting.cdn + '/static/config/brands.json');
        this.setState({
            filteredData: res.data,
            data: res.data,
        });
    }

    selectBrand(item) {
        const key = item.name;
        let { selectBrands } = this.state;
        if (selectBrands[key]) {
            delete selectBrands[key];
        } else {
            selectBrands[key] = key;
        }
        this.setState({
            selectBrands,
        });
    }

    unselectBrand(item) {
        const key = item.name;
        let { selectBrands } = this.state;
        if (selectBrands[key]) {
            delete selectBrands[key];
        } else {
            return;
        }
        this.setState({
            selectBrands,
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

    render() {
        const { selectedLetter, selectBrands, filteredData, keyword } = this.state;
        if (!filteredData) return null;

        return (
            <div className="option-group-filter">
                <div className="option-filter-search">
                    <input type="text" placeholder="可搜拼音、汉字查找品牌" value={keyword} onChange={ evt => this.onFilterKeyword(evt.currentTarget.value) } />
                </div>
                <div className="letter-nav">
                    <span className={`letter letter-all ${selectedLetter ? '' : 'selected'}`} onClick={() => { this.onFilterLetter(null) }}>所有品牌 <i className="icon-letter"></i></span>
                    {
                        LETTERS.map(letter => {
                            return <span key={letter} className={`letter ${selectedLetter === letter ? 'selected' : ''}`} onClick={() => { this.onFilterLetter(letter) }}>{letter} <i className="icon-letter"></i></span>
                        })
                    }
                </div>
                <div className="scroll-container">
                    <div className="brand-wraper">
                        <ul className="brands">
                            {
                                filteredData.map(item => {
                                    return (
                                        <li className={`brand-item ${selectBrands[item.name] ? 'selected' : ''}`}
                                            title={item.name} >
                                            <div className="brand-item-frame"></div>
                                            <div className="brand-item-wrapper" onClick={() => this.selectBrand(item)}>
                                                {
                                                    item.logo ? <img src={item.logo} alt={item.name} /> :
                                                        <span className="brand-item-name">{item.name}</span>
                                                }
                                            </div>
                                            <span className="close" onClick={() => this.unselectBrand(item)}><img src={window.Setting.cdn + '/static/img/icons/close.svg'} /></span>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default class SearchTool extends React.Component {

    state = {
        filter: {
            keyword: '',
            brands: [],
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-tool">
                <div className="option-group">
                    <div className="option-group-name">
                        <label>品牌</label>
                    </div>
                    <LetterSearchPanel />
                </div>
            </div>
        );
    }

}