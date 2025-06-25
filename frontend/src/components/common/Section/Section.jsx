// import ProductCard from "./ProductCard/ProductCard";

const Section = ({ title, bgColor, productItems }) => {
    return (
        <section className="product-section" style={{ background: bgColor }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="section-heading">
                    <h1 className="text-3xl font-bold">{title}</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/*{productItems.map((productItem) => (*/}
                    {/*    <ProductCard key={productItem.id} title={title} productItem={productItem} />*/}
                    {/*))}*/}
                </div>
            </div>
        </section>

    );
};

export default Section;