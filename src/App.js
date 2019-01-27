import React from 'react';

import { extend as helperExtend } from './utils/helper'; 
helperExtend();

import SearchTool from "./components/SearchTool";

import './App.scss';

class RootApp extends React.Component {

    state = {
        filter: {},
        log: ''
    };

    constructor(props) {
        super(props);
    }

    onSearch(filter) {
        this.setState({
            filter,
        });
    }

    render() {
        const { filter } = this.state;
        return (
            <div className="root" style={{ padding: 24 }}>
                <SearchTool onSearch={this.onSearch.bind(this)} filter={filter} />
                <div style={{ margin: '0 auto', marginTop: 30, width: 1190 }}>
                    <label>搜索过滤参数:</label>
                    {/* <textarea style={{ width:'100%', whiteSpace:'normal', wordWrap:'break-word', padding:'12px 16px', minHeight:280 }} value={log} onChange={evt => this.setState({ log: evt.currentTarget.value })} ></textarea> */}
                    <table style={{ width:'100%', background:'#fff' }}>
                        {
                            Object.keys(filter).map(key => {
                                const s = (filter[key] || []).map(item => {
                                    if (item.options && item.options.length > 0) {
                                        let opts = item.options.map(opt => opt.name);
                                        return `${item.name} - ${opts.join(', ')}`;
                                    }
                                    return item.name;
                                });
                                return (
                                    <tr style={{ height: 28, lineHeight:'28px' }}>
                                        <td style={{ padding: '0 8px' }}>{key}</td>
                                        <td style={{ padding: '0 8px' }}>
                                            <div 
                                                style={{ width: '100%', height: '100%', padding:'6px', display:'block', border:'none', resize: 'none' }} 
                                                >
                                                {JSON.stringify(s, null, 2)}
                                                <div style={{ position:'absolute', right: 12, top: 6, color: 'red', cursor: 'pointer' }}
                                                    onClick={ ()=> {
                                                        delete filter[key];
                                                        this.setState({ filter });
                                                    } }>
                                                    Delete
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </table>
                </div>
            </div>
        );
    }
}

export default RootApp;