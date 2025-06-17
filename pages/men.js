// pages/men.js - Simplified using CategoryPageTemplate
import ErrorBoundary from '../components/ErrorBoundary';
import CategoryPageTemplate from '../components/CategoryPageTemplate';


export default function MenPage() {
  return (
    <ErrorBoundary 
      title="Failed to load Men's content"
      message="We're having trouble loading the men's section. Please try refreshing the page."
    >
      <CategoryPageTemplate
        categoryId="67fd466dcaf2905cfc1b924d" // Men category ID
        categoryName="Men"
        heroTitle="Discover Posts on the Issues that Men Face"
        heroSubtitle="Engaging content just for you"
        featuredPostLabel="Discover Posts on the Issues that Men Face"
      />
    </ErrorBoundary>
  );
}