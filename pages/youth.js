// pages/youth.js - Simplified using CategoryPageTemplate
import ErrorBoundary from '../components/ErrorBoundary';
import CategoryPageTemplate from '../components/CategoryPageTemplate';

export default function YouthPage() {
  return (
    <ErrorBoundary 
      title="Failed to load Youth content"
      message="We're having trouble loading the youth section. Please try refreshing the page."
    >
      <CategoryPageTemplate
        categoryId="67fd4677caf2905cfc1b925a" // Youth category ID
        categoryName="Youth"
        heroTitle="Discover Posts on the Issues that the Youth Face"
        heroSubtitle="Engaging content just for you"
        featuredPostLabel="Discover Posts on the Issues that the Youth Face"
      />
    </ErrorBoundary>
  );
}