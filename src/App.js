import React from 'react';

import { extend as helperExtend } from './utils/helper'; 
helperExtend();

import SearchTool from "./components/SearchTool";

import './App.scss';

class RootApp extends React.Component {

    state = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="root" style={{ padding: 24 }}>
                <SearchTool />
            </div>
        );
    }
}

export default RootApp;