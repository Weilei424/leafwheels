import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  const categories = [
    {
      name: "Electric Cars",
      description: "Zero emissions, maximum performance",
      href: "/store?category=Vehicles",
      image: "/car-images/tesla.jpeg",
    },
    {
      name: "Accessories",
      description: "Enhance your driving experience",
      href: "/store?category=Accessories",
      image: "/accessories-images/tesla.charger.jpg",
    },
  ];

  return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our organized categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
                <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="group"
                >
                  <Link to={category.href} className="block">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-md transition-all duration-300">
                      <div className="h-80 bg-gray-100 flex items-center ojustify-center relative overflow-hidden">
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover  block mx-auto transition-transform duration-300"
                            />
                        )}
                        <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default CategoriesSection;
