import React from "react";
import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { label: "Vehicles Sold", value: "500+", icon: "🚗" },
    { label: "Happy Customers", value: "450+", icon: "😊" },
    { label: "Years Experience", value: "10+", icon: "📅" },
    { label: "CO2 Saved", value: "2.5M kg", icon: "🌱" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
