import React, { useEffect, useState, useRef } from 'react';
import { Masonry } from "react-responsive-masonry";

// Type definition for an image from Unsplash API
interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
        thumb: string;
    }; 
    alt_description: string;
}

// Modal component to display the selected image
const Modal: React.FC<{ image: UnsplashImage | null; onClose: () => void }> = ({ image, onClose }) => {
    if (!image) return null;
    
    return (
        <div className="modal" onClick={onClose}>
            <img src={image.urls.regular} alt={image.alt_description || 'Image'} />
        </div>
    );
};

// Main Gallery component
const Gallery: React.FC = () => {
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
    
    // Fetch images from Unsplash API
    const fetchImages = async () => {
        if (loading) return; // Prevent API calls while loading
        setLoading(true);

        const response = await fetch(`https://api.unsplash.com/photos?client_id=YOUR_ACCESS_KEY&page=${page}&per_page=25`);
        const data: UnsplashImage[] = await response.json();

        setImages((prevImages) => [...prevImages, ...data]);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, [page]);

    // Infinite scroll handler
    const observer = useRef<IntersectionObserver | null>(null);
    const lastImageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (lastImageRef.current) {
            observer.current.observe(lastImageRef.current);
        }
    }, [loading, images]);

    return (
        <div className="gallery">
            <Masonry columnsCount={3} gutter="16px">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        ref={index === images.length - 1 ? lastImageRef : null}
                    >
                        <img
                            src={image.urls.small}
                            alt={image.alt_description}
                            onClick={() => setSelectedImage(image)}
                        />
                    </div>
                ))}
            </Masonry>
            {loading && <p>Loading...</p>}
            <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
        </div>
    );
};

export default Gallery;