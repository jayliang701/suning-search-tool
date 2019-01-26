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
            log: `${JSON.stringify(filter, null, 2)}`,

        });
    }

    render() {
        const { log, filter } = this.state;
        return (
            <div className="root" style={{ padding: 24 }}>
                <SearchTool onSearch={this.onSearch.bind(this)} filter={filter} />
                <div style={{ margin: '0 auto', marginTop: 30, width: 1190 }}>
                    <label>搜索过滤参数:</label>
                    {/* <textarea style={{ width:'100%', whiteSpace:'normal', wordWrap:'break-word', padding:'12px 16px', minHeight:280 }} value={log} onChange={evt => this.setState({ log: evt.currentTarget.value })} ></textarea> */}
                    <table style={{ width:'100%', background:'#fff', border:'1px solid #ccc' }}>
                        {
                            Object.keys(filter).map(key => {
                                return (
                                    <tr style={{ height: 28, lineHeight:'28px' }}>
                                        <td style={{ padding: '0 8px', borderRight: '1px solid #ccc' }}>{key}</td>
                                        <td style={{ padding: '0 8px' }}><textarea style={{ width: '100%', height: '100%', padding:'13px', display:'block', border:'none', resize: 'none' }} defaultValue={JSON.stringify(filter[key], null, 2)}></textarea></td>
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