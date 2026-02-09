import { useEffect } from 'react';

export interface SEOData {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
}

export const useSEO = ({ 
    title = 'EventSphere - Connect and Celebrate', 
    description = 'Discover and host community events with ease.', 
    keywords = 'events, community, neighborhood, discover, host',
    ogImage = '/logo.png',
    ogType = 'website'
}: SEOData) => {
    useEffect(() => {
        document.title = title;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', ogImage);

        const ogT = document.querySelector('meta[property="og:type"]');
        if (ogT) ogT.setAttribute('content', ogType);

    }, [title, description, keywords, ogImage, ogType]);
};
