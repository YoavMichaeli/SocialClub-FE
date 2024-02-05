
import React from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import NavBar from './components/NavBar';
import PostsFeed from './components/Post/Feed';
import SingleFileUploader from './components/Post/Upload/Upload';
import Profile from './components/Profile';
import Search from "./components/Search";
import SignUp from './components/SignUp';
import MainFeedContextProvider from './contexts/MainFeed/MainFeed';

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <NavBar/>
                <Routes>
                    <Route path='/' element={<Login/>} />
                    <Route path='/signUp' element={<SignUp/>} />
                    <Route path='/feed' element={<PostsFeed/>} />
                    <Route path='/profile' element={<Profile/>} />
                    <Route path='/newPost' element={<SingleFileUploader/>} />
                    <Route path='/explore' element={<MainFeedContextProvider/>} />
                    <Route path='/:page' element={<Search/>} />
                </Routes>
                
            </div>
        </BrowserRouter>
    );
}

export default App;
