import React from "react-responsive-masonry";
import './App.css';
import Gallery from './gallery';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Infinite Scroll Image Gallery</h1>
            <Gallery />
        </div>
    );
}

export default App; 