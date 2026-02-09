import { useSEO, type SEOData } from '../../hooks/useSEO';

const SEO = (props: SEOData) => {
    useSEO(props);
    return null;
};

export default SEO;
